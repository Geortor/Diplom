from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import User, Category, Promotions, Models, ModelPhotos, ModelFiles


class ModelPhotosInline(admin.TabularInline):
    model = ModelPhotos
    extra = 0


class ModelFilesInline(admin.TabularInline):
    model = ModelFiles
    extra = 0


class ModelsAdmin(admin.ModelAdmin):
    inlines = [ModelPhotosInline, ModelFilesInline]
    list_display = ('id', 'name', 'on_sale')
    exclude = ('author',)

    def save_model(self, request, obj, form, change):
        """
        Переопределяем метод сохранения модели
        """
        if not change:  # Проверяем что запись только создаётся
            obj.author = request.user  # Присваеваем полю автор текущего пользователя
        obj.save()


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'image')
    exclude = ('slug',)


class PromotionsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Promotions._meta.get_fields()]


admin.site.unregister(Group)
admin.site.register(Models, ModelsAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Promotions, PromotionsAdmin)
admin.site.register(User, UserAdmin)
