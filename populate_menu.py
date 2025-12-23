import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'club_cafe.settings')
django.setup()

from core.models import Category, MenuItem
from django.utils.text import slugify

def populate():
    print("Populating database...")
    
    # Clear existing data
    Category.objects.all().delete()
    MenuItem.objects.all().delete()
    
    menu_data = {
        "Signature Cakes": [
            ("Classic Black Forest", 500.00, "Rich chocolate sponge with cherries and cream."),
            ("Red Velvet Delight", 600.00, "Smooth red velvet cake with cream cheese frosting."),
            ("Vanilla Buttercream", 450.00, "Classic vanilla cake with sweet buttercream."),
            ("Pineapple Fresh Cream", 550.00, "Fresh pineapple chunks in light cream."),
            ("Chocolate Truffle", 650.00, "Dense chocolate cake with truffle ganache.")
        ],
        "Premium Designer Cakes": [
            ("Ferrero Rocher Cake", 850.00, "Hazelnut chocolate cake loaded with Ferrero Rocher."),
            ("Oreo Crunch Cake", 750.00, "Chocolate cake with crunchy Oreo bits."),
            ("Blueberry Cheesecake", 900.00, "Creamy cheesecake with blueberry topping."),
            ("Butterscotch Caramel Cake", 700.00, "Butterscotch sponge with caramel drizzle.")
        ],
        "Cupcakes": [
            ("Chocolate Fudge Cupcake", 80.00, "Moist chocolate cupcake with fudge frosting."),
            ("Vanilla Sprinkle Cupcake", 70.00, "Vanilla cupcake with colorful sprinkles."),
            ("Red Velvet Cupcake", 90.00, "Mini red velvet treat with cream cheese."),
            ("Oreo Cupcake", 85.00, "Cupcake with Oreo crumbs and cream.")
        ],
        "Pastries": [
            ("Chocolate Pastry", 100.00, "Slice of rich chocolate cake."),
            ("Black Forest Pastry", 110.00, "Slice of classic black forest cake."),
            ("Strawberry Pastry", 120.00, "Fresh strawberry slice."),
            ("Butterscotch Pastry", 110.00, "Slice of butterscotch cake.")
        ]
    }
    
    for cat_name, items in menu_data.items():
        category = Category.objects.create(name=cat_name, slug=slugify(cat_name))
        print(f"Created Category: {category.name}")
        
        for item_name, price, desc in items:
            MenuItem.objects.create(
                category=category,
                name=item_name,
                price=price,
                description=desc,
                is_available=True
            )
            print(f"  - Added Item: {item_name}")
            
    print("Database populated successfully!")

if __name__ == '__main__':
    populate()
