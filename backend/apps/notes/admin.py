from django.contrib import admin
from .models import Note, Tag, Color, NoteTag

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at', 'color')
    list_filter = ('created_at', 'tags', 'color')
    search_fields = ('title', 'content')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(NoteTag)
class NoteTagAdmin(admin.ModelAdmin):
    list_display = ('note', 'tag')
    list_filter = ('tag',)
