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
const customerModal = document.getElementById('customerModal');
const closeCustomerModal = document.getElementById('closeCustomerModal');
const customerForm = document.getElementById('customerForm');
const backToCart = document.getElementById('backToCart');
const productModal = document.getElementById('productModal');
const closeProductModal = document.getElementById('closeProductModal');
const successModal = document.getElementById('successModal');
const continueShopping = document.getElementById('continueShopping');
const addToCartModal = document.getElementById('addToCartModal');

// Product details data
const productDetails = {
    1: {
        id: 1,
        name: "Hand-Painted Ceramic Vase",
        brand: "ClayCraft",
        price: 2499,
        originalPrice: 2999,
        image: "IMAGE_URL_HERE",
        description: "Beautiful hand-painted ceramic vase with traditional motifs. Each piece is uniquely crafted by skilled artisans using centuries-old techniques.",
        features: [
            "Handcrafted by skilled artisans",
            "Traditional painting techniques",
            "Food-safe ceramic glaze",
            "Unique design - no two pieces are identical",
            "Perfect for home decoration"
        ],
        specifications: {
            "Material": "Premium Ceramic",
            "Height": "12 inches",
            "Width": "6 inches",
            "Weight": "1.2 kg",
            "Care": "Hand wash only"
        }
    },
    2: {
        id: 2,
        name: "Traditional Handwoven Shawl",
        brand: "WeaveMagic",
        price: 1899,
        originalPrice: 2299,
        image: "IMAGE_URL_HERE",
        description: "Luxurious handwoven shawl made from premium natural fibers. Features intricate traditional patterns woven by master weavers.",
        features: [
            "100% natural cotton fibers",
            "Handwoven on traditional looms",
            "Intricate traditional patterns",
            "Soft and lightweight",
            "Perfect for all seasons"
        ],
        specifications: {
            "Material": "100% Natural Cotton",
            "Dimensions": "72 x 36 inches",
            "Weight": "450 grams",
            "Care": "Dry clean recommended",
            "Origin": "Varanasi, India"
        }
    },
    3: {
        id: 3,
        name: "Carved Wooden Jewelry Box",
        brand: "WoodArt",
        price: 3299,
        originalPrice: 3999,
        image: "IMAGE_URL_HERE",
        description: "Exquisitely carved wooden jewelry box with multiple compartments. Handcrafted from sustainable sheesham wood.",
        features: [
            "Hand-carved traditional motifs",
            "Sustainable sheesham wood",
            "Multiple compartments",
            "Soft-closing hinge",
            "Natural wood finish"
        ],
        specifications: {
            "Material": "Sheesham Wood",
            "Dimensions": "8 x 6 x 4 inches",
            "Compartments": "3 main + 2 small",
            "Finish": "Natural wood polish",
            "Weight": "800 grams"
        }
    },
    4: {
        id: 4,
        name: "Set of 4 Handmade Mugs",
        brand: "PotteryHub",
        price: 1599,
        originalPrice: 1999,
        image: "IMAGE_URL_HERE",
        description: "Beautiful set of 4 handmade ceramic mugs, each with unique glazing and perfect for your morning coffee or tea.",
        features: [
            "Set of 4 unique mugs",
            "Microwave and dishwasher safe",
            "Food-safe ceramic glaze",
            "Comfortable grip handle",
            "Perfect for daily use"
        ],
        specifications: {
            "Material": "Stoneware Ceramic",
            "Capacity": "350ml each",
            "Set Includes": "4 mugs",
            "Care": "Dishwasher safe",
            "Weight": "2.5 kg total"
        }
    },
    5: {
        id: 5,
        name: "Artisan Silver Earrings",
        brand: "SilverCraft",
        price: 1299,
        originalPrice: 1599,
        image: "IMAGE_URL_HERE",
        description: "Elegant silver earrings handcrafted with traditional filigree work, perfect for both traditional and contemporary wear.",
        features: [
            "925 Sterling Silver",
            "Handmade filigree work",
            "Hypoallergenic",
            "Lightweight and comfortable",
            "Elegant packaging included"
        ],
        specifications: {
            "Material": "925 Sterling Silver",
            "Length": "2.5 inches",
            "Weight": "8 grams",
            "Closure": "Secure latch",
            "Care": "Store in dry place"
        }
    },
    6: {
        id: 6,
        name: "Handwoven Bamboo Basket",
        brand: "BambooWorks",
        price: 899,
        originalPrice: 1199,
        image: "IMAGE_URL_HERE",
        description: "Eco-friendly handwoven bamboo basket, perfect for storage, picnics, or as a decorative piece in your home.",
        features: [
            "100% natural bamboo",
            "Handwoven by skilled artisans",
            "Eco-friendly and sustainable",
            "Lightweight yet durable",
            "Versatile use"
        ],
        specifications: {
            "Material": "Natural Bamboo",
            "Dimensions": "12 x 8 x 6 inches",
            "Weight": "300 grams",
            "Handle": "Integrated bamboo handle",
            "Care": "Wipe clean with damp cloth"
        }
    }
};

// Buy Now functionality
let currentProductForBuyNow = null;

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
    
    // Product interactions - only keep the essential ones that aren't handled elsewhere
    document.addEventListener('click', function(e) {
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
    let orderData;
    
    if (currentProductForBuyNow) {
        // Buy Now order
        orderData = {
            orderId: 'ORD' + Date.now(),
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            shippingAddress: formData.get('shippingAddress'),
            customerCity: formData.get('customerCity'),
            pincode: formData.get('pincode'),
            totalAmount: currentProductForBuyNow.price,
            items: [currentProductForBuyNow],
            orderType: 'buy_now'
        };
        
        // Clear the buy now product
        currentProductForBuyNow = null;
    } else {
        // Regular cart order
        orderData = {
            orderId: 'ORD' + Date.now(),
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            customerPhone: formData.get('customerPhone'),
            shippingAddress: formData.get('shippingAddress'),
            customerCity: formData.get('customerCity'),
            pincode: formData.get('pincode'),
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            items: [...cart],
            orderType: 'cart'
        };
        
        // Clear cart
        cart = [];
        updateCartUI();
    }

    // Send order data (your existing email logic)
    sendOrderEmail(orderData);
    
    // Show success modal
    closeCustomerForm();
    showSuccessModal(orderData);
}

function sendOrderEmail(orderData) {
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpNuHeUy5pI194LQEs6VvVl4J53pWPCxhRC25jni9gcAT07hKx77_h_1wkAM5G9-xi/exec"; // ← replace with your deployed URL

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(orderData)
    })
    .then(() => {
        console.log("Order details sent successfully via Google Apps Script");
    })
    .catch((error) => {
        console.error("Error sending order details:", error);
    });
}

// Buy Now functionality
function buyNowProduct(productId) {
    const productData = getProductData(productId);
    if (!productData) return;

    // Store the product for buy now
    currentProductForBuyNow = {
        ...productData,
        quantity: 1
    };

    // Close product modal if open
    closeProductDetails();
    
    // Show customer form directly
    showCustomerFormForBuyNow();
}

function showCustomerFormForBuyNow() {
    const customerModal = document.getElementById('customerModal');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');

    // Clear any existing cart items and set only the buy now product
    orderItems.innerHTML = '';
    
    if (currentProductForBuyNow) {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${currentProductForBuyNow.name} (Qty: 1)</span>
            <span>₹${currentProductForBuyNow.price}</span>
        `;
        orderItems.appendChild(orderItem);
        
        orderTotal.textContent = currentProductForBuyNow.price;
    }

    // Show customer modal
    customerModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update the back to cart button to handle buy now scenario
document.getElementById('backToCart').addEventListener('click', function() {
    closeCustomerForm();
    
    // If it was a buy now flow, reopen the product modal
    if (currentProductForBuyNow) {
        showProductDetails(currentProductForBuyNow.id);
        currentProductForBuyNow = null;
    } else {
        // Regular cart flow - open cart sidebar
        openCart();
    }
});

// Update close customer form to reset buy now state
function closeCustomerForm() {
    const customerModal = document.getElementById('customerModal');
    customerModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset buy now state if modal is closed without ordering
    currentProductForBuyNow = null;
}

// Add event listeners for product card buttons
document.addEventListener('click', function(e) {
    // Handle Add to Cart from product cards
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
        e.stopPropagation();
        return;
    }

    // Handle Buy Now from product cards
    if (e.target.classList.contains('buy-now-btn') || 
        e.target.closest('.buy-now-btn')) {
        const button = e.target.classList.contains('buy-now-btn') ? e.target : e.target.closest('.buy-now-btn');
        const productId = parseInt(button.dataset.id);
        buyNowProduct(productId);
        e.stopPropagation();
        return;
    }

    // Handle Buy Now from modal
    if (e.target.classList.contains('buy-now-btn-modal') || 
        e.target.closest('.buy-now-btn-modal')) {
        if (currentProductId) {
            buyNowProduct(currentProductId);
        }
        e.stopPropagation();
    }
});