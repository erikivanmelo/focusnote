from rest_framework import serializers
from .models import Note, Tag, Color

class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tag model.
    """
    class Meta:
        model = Tag
        fields = ['id', 'name']  # Includes relevant fields

class ColorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Color model.
    """
    class Meta:
        model = Color
        fields = ['id', 'name']  # Includes relevant fields

class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for the Note model, including handling of tags and colors.
    """
    tags = serializers.ListField(
        child = serializers.CharField(max_length = 40),  # List of tag names
        write_only = True  # This field is only used for input
    )
    tags_details = TagSerializer(source = 'tags', many = True, read_only = True)  # Details of existing tags
    color_details = ColorSerializer(source = 'color', read_only = True)  # Details of the color

    class Meta:
        model = Note
        fields = [
            'id',
            'title',
            'content',
            'created_at',
            'updated_at',
            'color',
            'color_details',
            'tags',
            'tags_details'
        ]

    def _handle_tags(self, instance, tags_data):
        """
        Método helper para manejar tags (creación/actualización)
        """
        instance.tags.clear()
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name = tag_name)
            instance.tags.add(tag)

    def create(self, validated_data):
        """
        Overrides the create method to handle tags when creating a note.
        """
        tags_data = validated_data.pop('tags', [])  # Extract tags from the payload
        note = Note.objects.create(**validated_data)  # Create the note

        # Update associated tags
        self._handle_tags(note, tags_data)

        return note

    def update(self, instance, validated_data):
        """
        Overrides the update method to handle tags when updating a note.
        """
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)  # Update the other fields

        # Update associated tags
        self._handle_tags(instance, tags_data)

        return instance
