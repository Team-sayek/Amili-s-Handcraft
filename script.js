// Hero Slider Logic
const slides = document.querySelectorAll('.hero-slide');
const nextBtn = document.querySelector('.hero-next');
const prevBtn = document.querySelector('.hero-prev');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide,i)=>slide.classList.toggle('active', i===index));
}

nextBtn.addEventListener('click', ()=>{
    currentSlide = (currentSlide+1)%slides.length;
    showSlide(currentSlide);
});

prevBtn.addEventListener('click', ()=>{
    currentSlide = (currentSlide-1+slides.length)%slides.length;
    showSlide(currentSlide);
});

setInterval(()=>{
    currentSlide = (currentSlide+1)%slides.length;
    showSlide(currentSlide);
},5000);

// Cart state
let cart = [];
let currentProductId = null;


const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const totalMrpElement = document.getElementById('totalMrp');
const totalDiscountElement = document.getElementById('totalDiscount');
const convenienceFeeElement = document.getElementById('convenienceFee');

// Google Apps Script Web App URL (replace with your deployed web app URL)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJypM8SROGCOBFNJCmiCn0EwkiPrudF9WZcaKvO4CTxAOIAizRLfa5ce7hiLOLVFC8/exec";

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCartUI();
});

// Setup event listeners
function setupEventListeners() {
    // Cart functionality
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    checkoutBtn.addEventListener('click', processOrder);
    
    // Customer form functionality
    closeCustomerModal.addEventListener('click', closeCustomerForm);
    backToCart.addEventListener('click', backToCartHandler);
    customerForm.addEventListener('submit', submitOrder);
    
    // Product modal functionality
    closeProductModal.addEventListener('click', closeProductDetails);
    addToCartModal.addEventListener('click', addToCartFromModal);
    
    // Success modal functionality
    continueShopping.addEventListener('click', closeSuccessModal);
    
    // Product interactions
    document.addEventListener('click', function(e) {
        // Add to cart from product cards
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
        
        // More info button
        if (e.target.classList.contains('more-info-btn') || e.target.parentElement.classList.contains('more-info-btn')) {
            const button = e.target.classList.contains('more-info-btn') ? e.target : e.target.parentElement;
            const productId = parseInt(button.dataset.id);
            showProductDetails(productId);
        }
        
        // Cart item controls
        if (e.target.classList.contains('quantity-btn')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                const isIncrease = e.target.classList.contains('increase') || e.target.parentElement.classList.contains('increase');
                updateCartItemQuantity(productId, isIncrease);
            }
        }
        
        // Remove item from cart
        if (e.target.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                removeFromCart(productId);
            }
        }
    });
}

// Cart functions
function addToCart(productId) {
    const product = getProductData(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartUI();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartItemQuantity(productId, isIncrease) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    if (isIncrease) {
        cartItem.quantity += 1;
    } else {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }

    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <span>Start shopping to add items to your cart</span>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.dataset.id = item.id;
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                        <span class="remove-item">Remove</span>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });
    }

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function getProductData(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!productCard) return null;

    return {
        id: productId,
        name: productCard.dataset.name,
        price: parseInt(productCard.dataset.price),
        image: productCard.querySelector('img').src
    };
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Modal functions
function openCart() {
    if (!cartSidebar.classList.contains('open')) {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartSidebar() {
    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function showCustomerForm() {
    customerModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update order summary in customer form
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    orderItems.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} (Qty: ${item.quantity})</span>
            <span>₹${item.price * item.quantity}</span>
        `;
        orderItems.appendChild(orderItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = total;
}

function closeCustomerForm() {
    customerModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function backToCartHandler() {
    closeCustomerForm();
    openCart();
}

function showProductDetails(productId) {
    const product = productDetails[productId];
    if (!product) return;
    
    currentProductId = productId;
    
    // Update modal content
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductBrand').textContent = product.brand;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalCurrentPrice').textContent = `₹${product.price}`;
    document.getElementById('modalOriginalPrice').textContent = `₹${product.originalPrice}`;
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    document.getElementById('modalDiscount').textContent = `${discount}% OFF`;
    
    document.getElementById('modalProductDescription').textContent = product.description;
    
    // Update features
    const featuresList = document.getElementById('modalFeaturesList');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Update specifications
    const specifications = document.getElementById('modalSpecifications');
    specifications.innerHTML = '';
    Object.entries(product.specifications).forEach(([key, value]) => {
        const specRow = document.createElement('div');
        specRow.className = 'spec-row';
        specRow.innerHTML = `
            <span class="spec-key">${key}:</span>
            <span class="spec-value">${value}</span>
        `;
        specifications.appendChild(specRow);
    });
    
    // Show modal
    productModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductDetails() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProductId = null;
}

function addToCartFromModal() {
    if (currentProductId) {
        addToCart(currentProductId);
        closeProductDetails();
    }
}

function showSuccessModal(orderData) {
    const successOrderDetails = document.getElementById('successOrderDetails');
    successOrderDetails.innerHTML = `
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
    `;
    
    successModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Order processing
function processOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCartSidebar();
    showCustomerForm();
}

function submitOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(customerForm);
    const orderData = {
        orderId: 'ORD' + Date.now(),
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        shippingAddress: formData.get('shippingAddress'),
        customerCity: formData.get('customerCity'),
        pincode: formData.get('pincode'),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: [...cart]
    };
    
    console.log('Order submitted:', orderData);
    

    sendOrderEmail(orderData);
    
    // Clear cart and show success
    cart = [];
    updateCartUI();
    closeCustomerForm();
    showSuccessModal(orderData);
}

function prevSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function pauseSlideshow() {
    clearInterval(slideInterval);
}
