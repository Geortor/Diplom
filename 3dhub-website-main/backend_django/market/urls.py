from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import *
from threedhub_site import settings
from django.conf.urls.static import static

urlpatterns = [
    path('home/', SiteHomePageView.as_view(), name='home'),
    path('market/', MarketHomePageView.as_view(), name='market_home'),
    path('model/<int:model_id>/', ModelView.as_view(), name='model'),
    path('download_model/<int:model_id>/', ModelDownloadView.as_view(), name='download_model'),
    path('cart/', CartApi.as_view(), name='cart'),
    path('cart/add/<int:model_id>/', CartAdd.as_view(), name='cart_add'),
    path('cart/remove/<int:product_id>/', cart_remove, name='cart_remove'),
    path('cart/check/<int:product_id>/', check_product_in_cart, name='check_product'),
    path('username_validate/<str:username>/', check_username, name='check_username'),
    path('signup/', UserRegisterView.as_view(), name='user_register'),
    path('signup/activate/<uidb64>/<token>/', is_activate, name='activate'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


