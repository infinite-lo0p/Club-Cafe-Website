from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class MenuItem(models.Model):
    category = models.ForeignKey(Category, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    DELIVERY_CHOICES = [
        ('Pickup', 'Pickup'),
        ('Delivery', 'Delivery'),
        ('Dine-in', 'Dine-in'),
    ]
    
    customer_name = models.CharField(max_length=100, blank=True)
    customer_email = models.EmailField(blank=True)
    delivery_mode = models.CharField(max_length=20, choices=DELIVERY_CHOICES, default='Pickup')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} - {self.delivery_mode}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name}"
