from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from .models import Category, MenuItem, Order, OrderItem

@ensure_csrf_cookie
def index(request):
    categories = Category.objects.prefetch_related('items').all()
    return render(request, 'core/index.html', {'categories': categories})

@require_POST
def add_to_cart(request):
    try:
        data = json.loads(request.body)
        item_id = str(data.get('id'))
        cart = request.session.get('cart', {})
        
        if item_id in cart:
            cart[item_id] += 1
        else:
            cart[item_id] = 1
            
        request.session['cart'] = cart
        return JsonResponse({'status': 'success', 'cart_count': sum(cart.values())})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def get_cart(request):
    cart = request.session.get('cart', {})
    items = []
    total = 0
    
    for item_id, quantity in cart.items():
        try:
            menu_item = MenuItem.objects.get(id=item_id)
            item_total = menu_item.price * quantity
            total += item_total
            items.append({
                'id': menu_item.id,
                'name': menu_item.name,
                'price': float(menu_item.price),
                'quantity': quantity,
                'item_total': float(item_total)
            })
        except MenuItem.DoesNotExist:
            continue
        
    return JsonResponse({'items': items, 'total': float(total)})

@require_POST
def clear_cart(request):
    request.session['cart'] = {}
    return JsonResponse({'status': 'success'})

@require_POST
def checkout(request):
    try:
        data = json.loads(request.body)
        delivery_mode = data.get('delivery_mode')
        customer_name = data.get('name', 'Guest')
        customer_email = data.get('email', '')
        
        cart = request.session.get('cart', {})
        if not cart:
            return JsonResponse({'status': 'error', 'message': 'Cart is empty'}, status=400)
            
        order = Order.objects.create(
            delivery_mode=delivery_mode,
            customer_name=customer_name,
            customer_email=customer_email
        )
        
        total_price = 0
        for item_id, quantity in cart.items():
            menu_item = MenuItem.objects.get(id=item_id)
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price=menu_item.price
            )
            total_price += menu_item.price * quantity
            
        order.total_price = total_price
        order.save()
        
        # Clear cart
        request.session['cart'] = {}
        
        return JsonResponse({'status': 'success', 'order_id': order.id, 'message': f'Order #{order.id} placed successfully!'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
