import hashlib
import os

import unidecode
from PIL import Image, ImageOps


from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.files.storage import FileSystemStorage
from django.urls import reverse
from django.db import models
from django.db.models import Q

from threedhub_site import settings


def upload_to(instance, filename, fieldname):
    ext = os.path.splitext(filename)[1].lower()
    class_name = instance.__class__.__name__.lower()

    h = hashlib.sha256()
    field = getattr(instance, fieldname)
    for chunk in field.chunks():
        h.update(chunk)
    name = h.hexdigest()

    return os.path.join(
        class_name,
        name + ext,
    )


def my_models_photo_path(obj, name):
    return upload_to(obj, name, 'image')


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            print('go1')
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class ViewCountModel(models.Model):
    """
    Модель просмотров для моделей
    """
    model = models.ForeignKey('Models', on_delete=models.CASCADE, related_name='views')
    ip_address = models.GenericIPAddressField(verbose_name='IP адрес')
    viewed_on = models.DateTimeField(auto_now_add=True, verbose_name='Дата просмотра')

    class Meta:
        ordering = ('-viewed_on',)
        indexes = [models.Index(fields=['-viewed_on'])]
        verbose_name = 'Просмотр модели'
        verbose_name_plural = 'Просмотры модели'

    def __str__(self):
        return self.model.name


class ModelLikes(models.Model):
    model = models.ForeignKey('Models', on_delete=models.CASCADE, related_name='likes')
    author = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name='Пользователь, который поставил лайк')
    liked_on = models.DateTimeField(auto_now_add=True, verbose_name='Дата лайка')

    class Meta:
        verbose_name = 'Лайк модели'
        verbose_name_plural = 'Лайки модели'

    def __str__(self):
        return self.model


class Models(models.Model):
    name = models.CharField(max_length=128, verbose_name='Имя модели', blank=True, null=True)
    description = models.TextField(max_length=2000, verbose_name='Описание модели', blank=True, null=True)
    author = models.ForeignKey('User', on_delete=models.CASCADE, verbose_name='Автор модели')
    price = models.IntegerField(verbose_name='Цена модели', blank=True, null=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Время создания модели')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Время последнего изменения модели')
    on_sale = models.BooleanField(default=True, verbose_name='В продаже')

    class Meta:
        verbose_name = 'Модель'
        verbose_name_plural = 'Модели'

    def __str__(self):
        return self.name

    def get_model_photo(self):
        return ModelPhotos.objects.filter(model=self.id)[0]

    def get_absolute_url(self):
        return reverse('model', kwargs={'model_id': self.id})

    def get_view_count(self):
        """
        Возвращает количество просмотров для данной модели
        """
        return self.views.count()


class ModelPhotos(models.Model):
    model = models.ForeignKey('Models', on_delete=models.CASCADE, verbose_name='Модель', related_name='model_images', unique=False)
    image = models.ImageField(blank=True, null=True, verbose_name='Фото модели', storage=OverwriteStorage(),
                              upload_to=my_models_photo_path)

    class Meta:
        verbose_name = 'Фото обложки модели'
        verbose_name_plural = 'Фото обложек моделей'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__image = self.image if self.pk else None

    def __str__(self):
        return f'Фото {self.id}'

    def save(self, *args, **kwargs):
        """
        Сохранение полей модели при их отсутствии заполнения
        """
        super().save(*args, **kwargs)
        if self.__image != self.image and self.image:
            image_compress(self.image.path, width=500, height=500)


class ModelFiles(models.Model):
    model = models.ForeignKey('Models', on_delete=models.CASCADE, unique=False, verbose_name='Модель')
    file = models.FileField(blank=True, null=True, verbose_name='Файл модели')

    class Meta:
        verbose_name = 'Файл модели'
        verbose_name_plural = 'Файлы модели'

    def __str__(self):
        return f'Модель {self.id}'


class Category(models.Model):
    name = models.CharField(max_length=128, unique=True, verbose_name='Название категории')
    slug = models.SlugField(max_length=128)
    image = models.ImageField(blank=True, null=True, upload_to='images/', verbose_name='Фото категории')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('category', kwargs={'cat_slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        super().save(*args, **kwargs)

    def is_available(self):
        query = Category.objects.filter(name=self.name).filter(~Q(id=self.id))
        return query

    def clean(self):
        if not self.name:
            raise ValidationError('Название категории не может быть пустым')
        if self.is_available():
            raise ValidationError('Категория с таким именем уже существует')


class Promotions(models.Model):
    product = models.ForeignKey('Models', models.CASCADE, blank=True, null=True, verbose_name='Модель')
    new_price = models.IntegerField(verbose_name='Новая цена')
    is_active = models.BooleanField(default=True, verbose_name='Активация акции')

    class Meta:
        verbose_name = 'Акция'
        verbose_name_plural = 'Акции'


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True, verbose_name='E-mail')
    username = models.CharField(max_length=20, unique=True, verbose_name='Username')
    is_verified = models.BooleanField(default=False)
    first_name = None
    last_name = None

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['email', ]


class ProfileUser(models.Model):
    MALE = 'M'
    FEMALE = 'F'
    GENDERS = [
        (MALE, 'Мужской'),
        (FEMALE, 'Женский')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True)
    first_name = models.CharField(max_length=254, verbose_name='Имя', null=True)
    last_name = models.CharField(max_length=254, verbose_name='Фамилия', null=True)
    decription = models.CharField(max_length=2000, verbose_name='Обо мне', null=True)
    avatar = models.ImageField(verbose_name='Аватар пользователя',
                               default='images/a6edc9062f9f5fb2a373efac406f0ef2.svg', upload_to='images/',
                               null=True, blank=True)
    date_birthday = models.DateField(null=True, verbose_name='Дата рождения')
    gender = models.CharField(max_length=1, choices=GENDERS, verbose_name='Пол', null=True)
    following = models.ManyToManyField('self', verbose_name='Подписки', related_name='followers', symmetrical=False,
                                       blank=True)
    paid_subscription = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse('user_profile', kwargs={'username': self.user.username})


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')


class CartModels(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_models')
    models = models.ManyToManyField(Models, related_name="models")


def image_compress(image_path, height, width):
    img = Image.open(image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    if img.height > height or img.width > width:
        output_size = (height, width)
        img.thumbnail(output_size)
    img = ImageOps.exif_transpose(img)
    img.save(image_path, format='PNG', quality=60, optimize=True)
