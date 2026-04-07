from sqladmin import Admin, ModelView

from .database import engine
from . import models


class TimelineEventAdmin(ModelView, model=models.TimelineEvent):
    column_list = [models.TimelineEvent.id, models.TimelineEvent.year, models.TimelineEvent.title, models.TimelineEvent.sort_order]
    column_searchable_list = [models.TimelineEvent.title]
    column_sortable_list = [models.TimelineEvent.year, models.TimelineEvent.sort_order]


class SectionAdmin(ModelView, model=models.Section):
    column_list = [models.Section.id, models.Section.slug, models.Section.title, models.Section.rocket_position, models.Section.sort_order]
    column_searchable_list = [models.Section.slug, models.Section.title]


class SubsectionAdmin(ModelView, model=models.Subsection):
    column_list = [models.Subsection.id, models.Subsection.section_id, models.Subsection.anchor_name, models.Subsection.title, models.Subsection.sort_order]
    column_searchable_list = [models.Subsection.title, models.Subsection.anchor_name]


class MediaFileAdmin(ModelView, model=models.MediaFile):
    column_list = [models.MediaFile.id, models.MediaFile.subsection_id, models.MediaFile.file_path, models.MediaFile.is_image, models.MediaFile.sort_order]


class MythAdmin(ModelView, model=models.Myth):
    column_list = [
        models.Myth.id,
        models.Myth.title,
        models.Myth.category,
        models.Myth.is_true,
        models.Myth.votes_for_true,
        models.Myth.votes_for_false,
        models.Myth.sort_order,
    ]
    column_searchable_list = [models.Myth.category, models.Myth.title]


class AboutContentAdmin(ModelView, model=models.AboutContent):
    column_list = [models.AboutContent.id]


class SectionContentAdmin(ModelView, model=models.SectionContent):
    column_list = [models.SectionContent.id, models.SectionContent.section_id, models.SectionContent.heading, models.SectionContent.anchor, models.SectionContent.sort_order]
    column_searchable_list = [models.SectionContent.heading, models.SectionContent.content]


class QuizQuestionAdmin(ModelView, model=models.QuizQuestion):
    column_list = [
        models.QuizQuestion.id,
        models.QuizQuestion.section_id,
        models.QuizQuestion.sort_order,
        models.QuizQuestion.question,
        models.QuizQuestion.correct_option,
    ]
    column_searchable_list = [models.QuizQuestion.question]
    column_sortable_list = [models.QuizQuestion.section_id, models.QuizQuestion.sort_order]


class QuoteAdmin(ModelView, model=models.Quote):
    column_list = [models.Quote.id, models.Quote.author, models.Quote.is_active]
    column_searchable_list = [models.Quote.text, models.Quote.author]


def setup_admin(app) -> None:
    admin = Admin(app, engine)
    admin.add_view(TimelineEventAdmin)
    admin.add_view(SectionAdmin)
    admin.add_view(SubsectionAdmin)
    admin.add_view(MediaFileAdmin)
    admin.add_view(MythAdmin)
    admin.add_view(AboutContentAdmin)
    admin.add_view(SectionContentAdmin)
    admin.add_view(QuizQuestionAdmin)
    admin.add_view(QuoteAdmin)

