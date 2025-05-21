from django.db import models

class Color(models.Model):
    name = models.CharField(max_length = 8, null = False)

class Tag(models.Model):
    name = models.CharField(max_length = 40, unique = True, null = False)

class Note(models.Model):
    title = models.CharField(max_length = 100, blank = True, null = True)
    content = models.TextField(null = False, blank = False)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

     # Relationship with colors
    color = models.ForeignKey(
        Color,
        on_delete = models.SET_NULL,
        null = True,
        related_name = 'notes',
    )

    # Many-to-Many relationship with tags
    tags = models.ManyToManyField(
        Tag,
        null = True,
        through = 'NoteTag',
        related_name = 'notes'
    )

class NoteTag(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('note', 'tag')  # A unique combination of note and tag
