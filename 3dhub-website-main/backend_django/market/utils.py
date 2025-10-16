from .models import Category

header_menu = [
    {'title': 'Маркетплейс', 'url': '/market/'},
    {'title': 'Обучение', 'url': '/'},
    {'title': 'О нас', 'url': '/'},
    {'title': 'Сообщество', 'url': '/'}
]

over_footer_menu = [
    {'submenu': {
        'title': 'Главная',
        'subsubmenu': [
            {'title': 'Партнеры'},
            {'title': 'Донат'},
            {'title': 'Сообщество'},
            {'title': 'Поддержка'},
            {'title': 'Ресурсы'}
        ]
    }},
    {'submenu': {
        'title': 'Наши продукты',
        'subsubmenu': [
            {'title': '3D модели'},
            {'title': 'Курсы'}
        ]
    }},

    {'submenu': {
        'title': 'О компании',
        'subsubmenu': [
            {'title': 'О нас'},
            {'title': 'Команда'},
            {'title': 'Культура'},
            {'title': 'Новости'},
            {'title': 'Карьера'}
        ]
    }}
]

under_footer_menu = [{'title': 'Правила использования'}, {'title': 'Политика конфиденциальности'},
                     {'title': 'Контакты'}]


class BaseMixin:
    def get_user_context(self, **kwargs):
        context = kwargs
        cats = Category.objects.all()
        context['header_menu'] = header_menu.copy()
        context['over_footer_menu'] = over_footer_menu.copy()
        context['under_footer_menu'] = under_footer_menu.copy()
        context['cats'] = cats
        return context


def get_client_ip(request):
    """
    Получение IP адреса
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip