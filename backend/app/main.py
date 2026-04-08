import os
import json
from .seed import seed_if_empty
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

load_dotenv()

from . import admin, models, schemas
from .database import SessionLocal, engine

# ВАЖНО: импортируем все модели, чтобы Base знал о них
from .models import (
    Base,
    TimelineEvent,
    Quote,
    Section,
    SectionContent,
    QuizQuestion,
    Myth,
    AboutContent,
)

# СОЗДАЁМ ТАБЛИЦЫ (модели уже загружены)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Korolev Encyclopedia API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    # Заполняем базу данными, если она пустая (первый запуск / новая БД)
    db = SessionLocal()
    try:
        seed_if_empty(db)
        db.commit()
    finally:
        db.close()
    admin.setup_admin(app)


# ==================== ЭНДПОИНТЫ ====================

@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}


@app.get("/timeline", response_model=List[schemas.TimelineEventOut])
def get_timeline_events(
    db: Session = Depends(get_db),
) -> List[schemas.TimelineEventOut]:
    return db.query(models.TimelineEvent).order_by(
        models.TimelineEvent.sort_order, models.TimelineEvent.year
    ).all()


@app.get("/quote", response_model=schemas.QuoteOut)
def get_active_quote(db: Session = Depends(get_db)) -> schemas.QuoteOut:
    quote = db.query(models.Quote).filter(
        models.Quote.is_active == True
    ).order_by(models.Quote.id.desc()).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@app.get("/sections", response_model=List[schemas.SectionListItem])
def get_sections(db: Session = Depends(get_db)) -> List[schemas.SectionListItem]:
    return db.query(models.Section).order_by(models.Section.sort_order).all()


@app.get("/sections/{slug}", response_model=schemas.SectionDetailOut)
def get_section_detail(
    slug: str = Path(..., description="Section slug"),
    db: Session = Depends(get_db),
) -> schemas.SectionDetailOut:
    section = db.query(models.Section).filter(models.Section.slug == slug).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@app.get("/sections/{slug}/content", response_model=schemas.SectionContentOut)
def get_section_content(
    slug: str = Path(..., description="Section slug"),
    db: Session = Depends(get_db),
) -> schemas.SectionContentOut:
    section = db.query(models.Section).filter(models.Section.slug == slug).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    blocks = (
        db.query(models.SectionContent)
        .filter(models.SectionContent.section_id == section.id)
        .order_by(models.SectionContent.sort_order, models.SectionContent.id)
        .all()
    )
    
    if not blocks:
        raise HTTPException(status_code=404, detail="Section content not found")

    return schemas.SectionContentOut(
        section_id=section.id,
        slug=section.slug,
        title=section.title,
        short_description=section.short_description,
        image_url=section.image_url,
        blocks=[
            schemas.SectionContentBlockOut(
                id=b.id,
                heading=b.heading,
                anchor=b.anchor,
                content=b.content,
                images=json.loads(b.images or "[]"),
                documents=json.loads(b.documents or "[]"),
                sort_order=b.sort_order,
            )
            for b in blocks
        ],
    )


@app.get("/sections/{section_id}/quiz", response_model=List[schemas.QuizQuestionOut])
def get_section_quiz(
    section_id: int = Path(..., description="Section ID"),
    db: Session = Depends(get_db),
) -> List[schemas.QuizQuestionOut]:
    section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return (
        db.query(models.QuizQuestion)
        .filter(models.QuizQuestion.section_id == section_id)
        .order_by(models.QuizQuestion.sort_order, models.QuizQuestion.id)
        .all()
    )


@app.get("/sections/{slug}/quiz", response_model=List[schemas.QuizQuestionOut])
def get_section_quiz_by_slug(
    slug: str = Path(..., description="Section slug"),
    db: Session = Depends(get_db),
) -> List[schemas.QuizQuestionOut]:
    section = db.query(models.Section).filter(models.Section.slug == slug).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return (
        db.query(models.QuizQuestion)
        .filter(models.QuizQuestion.section_id == section.id)
        .order_by(models.QuizQuestion.sort_order, models.QuizQuestion.id)
        .all()
    )


@app.post("/quiz/check", response_model=schemas.QuizCheckOut)
def check_quiz_answer(
    payload: schemas.QuizCheckIn,
    db: Session = Depends(get_db)
) -> schemas.QuizCheckOut:
    q = db.query(models.QuizQuestion).filter(models.QuizQuestion.id == payload.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    if payload.selected_option not in (1, 2, 3):
        raise HTTPException(status_code=422, detail="selected_option must be 1, 2 or 3")
    
    correct = q.correct_option == payload.selected_option
    return schemas.QuizCheckOut(
        correct=correct,
        correct_option=q.correct_option,
        explanation=q.explanation
    )


@app.get("/about", response_model=schemas.AboutContentOut)
def get_about_content(db: Session = Depends(get_db)) -> schemas.AboutContentOut:
    about = db.query(models.AboutContent).first()
    if not about:
        raise HTTPException(status_code=404, detail="About content not found")
    
    return schemas.AboutContentOut(
        id=about.id,
        goal=about.goal,
        mission=getattr(about, "mission", None) or "",
        relevance=getattr(about, "relevance", None) or "",
        sources=about.sources,
        team_members=json.loads(about.team_members or "[]"),
    )


@app.get("/myths", response_model=List[schemas.MythOut])
def get_myths(
    category: Optional[str] = Query(default=None, description="Filter by category"),
    db: Session = Depends(get_db),
) -> List[schemas.MythOut]:
    query = db.query(models.Myth)
    if category:
        query = query.filter(models.Myth.category == category)
    return query.order_by(models.Myth.sort_order).all()


@app.post("/myths/{myth_id}/vote", response_model=schemas.MythOut)
def vote_myth(
    myth_id: int = Path(..., description="Myth ID"),
    payload: schemas.MythVoteIn = ...,
    db: Session = Depends(get_db),
) -> schemas.MythOut:
    myth = db.query(models.Myth).filter(models.Myth.id == myth_id).first()
    if not myth:
        raise HTTPException(status_code=404, detail="Myth not found")
    
    if payload.vote:
        myth.votes_for_true += 1
    else:
        myth.votes_for_false += 1
    
    db.add(myth)
    db.commit()
    db.refresh(myth)
    return myth