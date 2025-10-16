import zipfile
import io

import unidecode
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from threedhub_site.settings import DEBUG
from .cart import Cart
from .models import Models, ViewCountModel, ModelFiles, User
from .tokens import account_activation_token
from .utils import BaseMixin, get_client_ip
from .serializers import ModelsSerializer, ModelsSerializerForModelCard


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


class UserRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        is_registered = User.objects.filter(email=data['email']).exists()
        if not is_registered:
            user = User.objects.create(username=data['username'], email=data['email'],
                                       password=make_password(data['password']), is_verified=False)
            user.save()

            html_body = render_to_string(
                    'market/verify_mail.html',
                    {
                        'domain': 'localhost:3000' if DEBUG else '3dhub.site',
                        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                        'token': account_activation_token.make_token(user),
                        'protocol': 'https' if request.is_secure() else 'http'
                     }
            )
            msg = EmailMultiAlternatives(
                subject='Подтверждение регистрации аккаунта',
                from_email='info@3dhub.site',
                to=[data['email'], ]
            )
            msg.attach_alternative(html_body, 'text/html')
            msg.send()

            return Response({'Success': 'User Created Successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({"Fail": "User Already Exists"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def is_activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except:
        user = None
    if user and account_activation_token.check_token(user, token):
        user.is_verified = True
        user.save()

        return Response({"Success"}, status=status.HTTP_200_OK)
    else:
        return Response({"Fail": "Activate link is wrong"}, status=status.HTTP_400_BAD_REQUEST)


class SiteHomePageView(APIView, BaseMixin):
    def get(self, request, *args, **kwargs):
        context = self.get_user_context()

        return Response(data=context, status=200)


class MarketHomePageView(APIView, BaseMixin):
    def get(self, request, *args, **kwargs):
        models = Models.objects.all().order_by('pk')
        serializer = ModelsSerializerForModelCard(models, many=True)

        return Response(serializer.data, status=200)


class ModelView(APIView, BaseMixin):
    def get(self, request, *args, **kwargs):
        ip = get_client_ip(request)
        obj = get_object_or_404(Models, id=self.kwargs['model_id'])
        if not ViewCountModel.objects.filter(model=obj, ip_address=ip).exists():
            ViewCountModel.objects.create(model=obj, ip_address=ip)

        serializer_model = ModelsSerializer(obj, read_only=True)
        count_views = ViewCountModel.objects.filter(model=obj).count()

        return Response(serializer_model.data | {'count_views': count_views}, status=200)


class ModelDownloadView(APIView, BaseMixin):
    def get(self, request, *args, **kwargs):
        model_files = ModelFiles.objects.filter(model=self.kwargs['model_id'])

        zip_file_name = unidecode.unidecode(model_files[0].model.name)
        byte_data = io.BytesIO()
        zip_file = zipfile.ZipFile(byte_data, "w")
        for file in model_files:
            file_binary = open(file.file.path, 'rb')
            file_name = f'{zip_file_name}.{file.file.name.split(".")[-1]}'
            zip_file.writestr(file_name, file_binary.read())
        zip_file.close()

        response = HttpResponse(byte_data.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename={zip_file_name}.zip'
        return response


class CartApi(APIView, BaseMixin):
    def get(self, request, *args, **kwargs):
        cart = Cart(request)
        print(cart.__len__())
        return Response(cart.cart, status=200)


class CartAdd(APIView, BaseMixin):
    def post(self, request, *args, **kwargs):
        cart = Cart(request)
        cart.add(model=self.kwargs['model_id'])
        return Response(
            {
                "total_price": cart.get_total_price(),
                "total_quantity_products": cart.total_quantity_models()
            },
            status=200)


@api_view(['POST'])
def cart_remove(request, product_id):
    if is_ajax(request):
        cart = Cart(request)
        product = get_object_or_404(Models, id=product_id)
        cart.remove(product)

        return Response({
            "total_price": cart.get_total_price(),
            "total_quantity_products": cart.total_quantity_models()
        }, status=200)


@api_view(['GET'])
def check_product_in_cart(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Models, id=product_id)
    if is_ajax(request):
        return Response({'product_in_the_cart': cart.check_model_in_cart(product)}, status=200)


@api_view(['POST'])
def check_username(request, username):
    user = User.objects.filter(username=username).exists()

    return Response({
        "is_exists": user
    }, status=200)
