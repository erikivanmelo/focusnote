from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Note, Tag, Color
from .serializers import NoteSerializer, TagSerializer, ColorSerializer

class NoteViewSet(ModelViewSet):
    """
    ViewSet for the Note model.
    """
    queryset = Note.objects.prefetch_related('tags').select_related('color')
    serializer_class = NoteSerializer


class TagViewSet(ModelViewSet):
    """
    ViewSet for the Tag model.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    @action(detail=False, methods=['get'], url_path='names')
    def getNames(self, request):
        names = list(self.get_queryset().values_list('name', flat=True))
        return Response(names)

class ColorViewSet(ModelViewSet):
    """
    ViewSet for the Color model.
    """
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
