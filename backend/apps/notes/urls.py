from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TagViewSet, ColorViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'colors', ColorViewSet, basename='color')

urlpatterns = [
    path('', include(router.urls)),
]
