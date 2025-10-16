from django.conf import settings

from .models import Models


# creating a shopping cart
class Cart(object):
    def __init__(self, request):
        self.session = request.session
        self.cart = self.session.get(settings.CART_SESSION_ID)
        if not self.cart:
            # save an empty cart in the session
            self.cart = self.session[settings.CART_SESSION_ID] = {}

    def __len__(self):
        return self.cart.keys().__len__()

    def check_model_in_cart(self, model):
        if str(model.id) in self.cart:
            return True
        else:
            return False

    def get_total_price(self):
        return sum(int(Models.objects.get(id=item).price) for item in self.cart.keys())

    def total_quantity_models(self):
        return len(self.cart.values())

    def add(self, model):
        current_model = Models.objects.get(id=model)
        model_id = str(current_model.id)
        self.cart[model_id] = {'price': '50'}
        self.save()

    def save(self):
        # update cart session
        self.session[settings.CART_SESSION_ID] = self.cart
        # mark the session as "modified" to make sure it is saved
        self.session.modified = True

    def remove(self, model):
        model_id = str(model.id)
        if model_id in self.cart:
            del self.cart[model_id]
            self.save()

    # deleting a cart from a session
    def clear(self):
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
