from typing import Any, List, Optional

from pydantic import BaseModel


class TimelineEventBase(BaseModel):
    year: int
    title: str
    description: str
    short_description: Optional[str] = None
    is_central: bool = False
    sort_order: int


class TimelineEventOut(TimelineEventBase):
    id: int

    class Config:
        from_attributes = True


class SectionListItem(BaseModel):
    id: int
    slug: str
    title: str
    short_description: str
    image_url: Optional[str] = None
    rocket_position: Optional[str] = None
    sort_order: int

    class Config:
        from_attributes = True


class SectionContentBlockOut(BaseModel):
    id: int
    heading: str
    anchor: str
    content: str
    images: List[str] = []
    documents: List[str] = []
    sort_order: int

    class Config:
        from_attributes = True


class AboutContentOut(BaseModel):
    id: int
    goal: str
    mission: str
    relevance: str
    sources: str
    team_members: List[dict[str, Any]]

    class Config:
        from_attributes = True


class MythOut(BaseModel):
    id: int
    title: str
    description: str
    truth: str
    category: str
    is_true: bool
    votes_for_true: int
    votes_for_false: int
    sort_order: int

    class Config:
        from_attributes = True


class MythVoteIn(BaseModel):
    vote: bool


class QuoteOut(BaseModel):
    text: str
    author: Optional[str] = None

    class Config:
        from_attributes = True


class SectionContentOut(BaseModel):
    section_id: int
    slug: str
    title: str
    short_description: str
    image_url: Optional[str] = None
    blocks: List[SectionContentBlockOut] = []


class MediaFileOut(BaseModel):
    id: int
    file_path: str
    caption: Optional[str] = None
    is_image: bool
    sort_order: int

    class Config:
        from_attributes = True


class SubsectionOut(BaseModel):
    id: int
    anchor_name: str
    title: str
    content_html: str
    sort_order: int
    media_files: List[MediaFileOut] = []

    class Config:
        from_attributes = True


class SectionDetailOut(BaseModel):
    id: int
    slug: str
    title: str
    short_overview: str
    short_description: str
    image_url: Optional[str] = None
    rocket_position: str
    sort_order: int
    subsections: List[SubsectionOut] = []

    class Config:
        from_attributes = True


class QuizQuestionOut(BaseModel):
    id: int
    section_id: int
    question: str
    option1: str
    option2: str
    option3: str

    class Config:
        from_attributes = True


class QuizCheckIn(BaseModel):
    question_id: int
    selected_option: int


class QuizCheckOut(BaseModel):
    correct: bool
    correct_option: int
    explanation: Optional[str] = None

