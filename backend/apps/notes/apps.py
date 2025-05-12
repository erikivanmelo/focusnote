from django.apps import AppConfig


class NotesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.notes'

    def ready(self):
        import sys
        from django.db import connection

        if 'makemigrations' in sys.argv or 'migrate' in sys.argv:
            return

        try:
            table_exists: bool = "notes_color" in connection.introspection.table_names()
            if table_exists:
                from .models import Color
                default_colors = ["light", "pink", "red", "orange", "yellow", "green", "blue", "purple"]
                for color_name in default_colors:
                    Color.objects.get_or_create(name = color_name)
        except Exception:
            pass
