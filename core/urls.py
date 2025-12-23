from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('api/get-cart/', views.get_cart, name='get_cart'),
    path('api/checkout/', views.checkout, name='checkout'),
    path('api/clear-cart/', views.clear_cart, name='clear_cart'),
]
