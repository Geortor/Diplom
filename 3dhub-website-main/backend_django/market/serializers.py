from rest_framework import serializers
from .models import Models, User, ProfileUser, ModelPhotos, ModelFiles


class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    extra_kwargs = {
        'first_name': {'required': True, 'allow_blank': False},
        'last_name': {'required': True, 'allow_blank': False},
        'email': {'required': True, 'allow_blank': False},
        'password': {'required': True, 'allow_blank': False},
    }


class ProfileUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileUser
        fields = ('avatar', 'following')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileUserSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'is_staff', 'profile')


class ModelPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelPhotos
        fields = ('image',)


class ModelsSerializerForModelCard(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Models
        fields = ('id', 'name', 'author', 'images', 'price')

    def get_images(self, obj):
        images = obj.model_images.all()
        return ModelPhotosSerializer(images, many=True).data


class ModelsSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Models
        fields = ('id', 'name', 'author', 'images', 'price', 'description', 'time_create')

    def get_images(self, obj):
        images = obj.model_images.all()
        return ModelPhotosSerializer(images, many=True).data


class ModelFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelFiles
        fields = ('id', 'file')


class DownloadModelSerializer(serializers.ModelSerializer):
    files = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Models
        fields = ('files', )

    def get_files(self, obj):
        files = obj.model_images.all()
        return ModelFileSerializer(files, many=True).data
