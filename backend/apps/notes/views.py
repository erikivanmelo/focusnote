from rest_framework.viewsets import ModelViewSet
from .models import Note, Tag, Color
from .serializers import NoteSerializer, TagSerializer, ColorSerializer

class NoteViewSet(ModelViewSet):
    """
    ViewSet for the Note model.
    """
    queryset = Note.objects.prefetch_related('tags').select_related('color')  # Optimizes the query
    serializer_class = NoteSerializer

class TagViewSet(ModelViewSet):
    """
    ViewSet for the Tag model.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ColorViewSet(ModelViewSet):
    """
    ViewSet for the Color model.
    """
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
