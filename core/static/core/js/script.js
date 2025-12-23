document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateButtonIcon(currentTheme);
    } else {
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateButtonIcon(systemTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateButtonIcon(newTheme);
        });
    }

    function updateButtonIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        } else {
            themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        }
    }

    // CART LOGIC

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    function fetchCart() {
        fetch('/api/get-cart/')
            .then(res => res.json())
            .then(data => {
                updateCartUI(data);
            });
    }

    function updateCartUI(data) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        const cartEmptyMsg = document.getElementById('cart-empty-message');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (data.items.length === 0) {
            cartEmptyMsg.style.display = 'block';
            cartSummary.style.display = 'none';
        } else {
            cartEmptyMsg.style.display = 'none';
            cartSummary.style.display = 'block';

            data.items.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.style.marginBottom = '10px';
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>₹ ${item.item_total}</span>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });

            cartTotalSpan.innerText = data.total;
        }
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');

            fetch('/api/add-to-cart/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ id: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        fetchCart();
                        const originalText = e.target.innerText;
                        e.target.innerText = "Added!";
                        setTimeout(() => e.target.innerText = originalText, 1000);
                    }
                });
        });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const deliveryMode = document.getElementById('delivery-mode').value;
            const name = document.getElementById('order-name').value;
            const email = document.getElementById('order-email').value;

            fetch('/api/checkout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    delivery_mode: deliveryMode,
                    name: name,
                    email: email
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Show success message inside the cart container
                        const cartContainer = document.getElementById('cart-container');
                        cartContainer.innerHTML = `
                        <div class="success-message">
                            <span class="success-icon">🎉</span>
                            <h3>Order Placed Successfully!</h3>
                            <p class="output">Order #${data.order_id}</p>
                            <p class="desc">Thank you, ${name || 'Guest'}. Your order will be ready shortly.</p>
                            <button class="btn margin-top" onclick="location.reload()">Continue Shopping</button>
                        </div>
                    `;
                    } else {
                        alert('Error: ' + data.message);
                    }
                });
        });
    }

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear the cart?")) {
                fetch('/api/clear-cart/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        fetchCart();
                    });
            }
        });
    }

    // Initial fetch
    fetchCart();
});
