from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    # legacy fields kept for compatibility; not used by the final UI
    short_description = Column(Text, nullable=True)
    type = Column(String(50), nullable=True)
    is_central = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    # Legacy section page header fields (used by current UI)
    short_overview = Column(Text, nullable=False, default="")
    # Used on homepage cards/buttons
    short_description = Column(Text, nullable=False)
    image_url = Column(String(512), nullable=True)
    rocket_position = Column(String(100), nullable=False, default="0")
    sort_order = Column(Integer, default=0)

    # content blocks (anchors)
    content_blocks = relationship(
        "SectionContent",
        back_populates="section",
        cascade="all, delete-orphan",
        order_by="SectionContent.sort_order",
    )
    subsections = relationship(
        "Subsection",
        back_populates="section",
        cascade="all, delete-orphan",
        order_by="Subsection.sort_order",
    )
    quiz_questions = relationship("QuizQuestion", back_populates="section", cascade="all, delete-orphan")


class Subsection(Base):
    __tablename__ = "subsections"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    anchor_name = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    content_html = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)

    section = relationship("Section", back_populates="subsections")
    media_files = relationship(
        "MediaFile",
        back_populates="subsection",
        cascade="all, delete-orphan",
        order_by="MediaFile.sort_order",
    )


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(Integer, primary_key=True, index=True)
    subsection_id = Column(Integer, ForeignKey("subsections.id", ondelete="CASCADE"), nullable=False, index=True)
    file_path = Column(String(512), nullable=False)
    caption = Column(String(255), nullable=True)
    is_image = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    subsection = relationship("Subsection", back_populates="media_files")


class Myth(Base):
    __tablename__ = "myths"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=False)
    truth = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # politics/tech/personality
    is_true = Column(Boolean, default=False)
    votes_for_true = Column(Integer, default=0)
    votes_for_false = Column(Integer, default=0)
    sort_order = Column(Integer, default=0)


class AboutContent(Base):
    __tablename__ = "about_content"

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(Text, nullable=False)
    mission = Column(Text, nullable=False, default="")
    relevance = Column(Text, nullable=False, default="")
    sources = Column(Text, nullable=False)
    # JSON string: [{name, role, photo_url}]
    team_members = Column(Text, nullable=False)


class SectionContent(Base):
    __tablename__ = "section_contents"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    heading = Column(String(255), nullable=False)
    anchor = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)  # HTML/Markdown (frontend renders as HTML for now)
    images = Column(Text, nullable=False, default="[]")  # JSON array of URLs
    documents = Column(Text, nullable=False, default="[]")  # JSON array of URLs
    sort_order = Column(Integer, default=0)

    section = relationship("Section", back_populates="content_blocks")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    option1 = Column(Text, nullable=False)
    option2 = Column(Text, nullable=False)
    option3 = Column(Text, nullable=False)
    correct_option = Column(Integer, nullable=False)  # 1, 2 or 3
    explanation = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)

    section = relationship("Section", back_populates="quiz_questions")


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    author = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

