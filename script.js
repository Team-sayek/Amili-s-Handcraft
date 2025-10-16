// Cart state
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const totalMrpElement = document.getElementById('totalMrp');
const totalDiscountElement = document.getElementById('totalDiscount');
const convenienceFeeElement = document.getElementById('convenienceFee');

// Google Apps Script Web App URL (replace with your deployed web app URL)
const GOOGLE_SCRIPT_URL = "././././././././././";

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCartUI();
    initHeroSlider();
});

// Setup event listeners
function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-bag-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
            return;
        }

        if (e.target.classList.contains('quantity-btn')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                const isIncrease = e.target.classList.contains('increase');
                updateCartItemQuantity(productId, isIncrease);
            }
        }

        if (e.target.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                removeFromCart(productId);
            }
        }
    });

    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);

    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your bag is empty!');
            return;
        }
        processOrder();
    });
}

// Get product data from HTML
function getProductData(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!productCard) return null;

    const brand = productCard.dataset.brand;
    const name = productCard.dataset.name;
    const price = parseInt(productCard.dataset.price);
    const image = productCard.querySelector('img').src;

    return { id: productId, brand, name, price, image, quantity: 0 };
}

// Cart functions
function addToCart(productId) {
    const productData = getProductData(productId);
    if (!productData) return;

    const existingItemIndex = cart.findIndex(item => item.id === productId);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        productData.quantity = 1;
        cart.push({...productData});
    }

    updateCartUI();
    updateProductButtons();

    const button = document.querySelector(`.add-to-bag-btn[data-id="${productId}"]`);
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'ADDED TO BAG';
        button.classList.add('added');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('added');
        }, 2000);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateProductButtons();
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
                <p>Your bag is empty</p>
                <span>Start shopping to add items to your bag</span>
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
                    <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
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

    updateCartTotals();
}

function updateCartTotals() {
    const totalMrp = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const convenienceFee = totalMrp > 0 ? 99 : 0;
    cartTotal = totalMrp + convenienceFee;

    totalMrpElement.textContent = totalMrp;
    totalDiscountElement.textContent = 0;
    convenienceFeeElement.textContent = convenienceFee;
    cartTotalElement.textContent = cartTotal;
}

function updateProductButtons() {
    const allButtons = document.querySelectorAll('.add-to-bag-btn');
    allButtons.forEach(button => {
        button.textContent = 'ADD TO BAG';
        button.classList.remove('added');
    });

    cart.forEach(item => {
        const button = document.querySelector(`.add-to-bag-btn[data-id="${item.id}"]`);
        if (button && item.quantity > 0) {
            button.textContent = 'ADDED TO BAG';
            button.classList.add('added');
        }
    });
}

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Order Processing Functions
function processOrder() {
    showCustomerForm();
}

function showCustomerForm() {
    const customerFormHTML = `
        <div class="order-modal" id="customerFormModal">
            <div class="order-modal-content">
                <div class="order-modal-header">
                    <h3>Customer Information</h3>
                    <button class="close-order-modal">&times;</button>
                </div>
                <form id="customerInfoForm">
                    <!-- Personal & Shipping Details -->
                    <div class="form-section">
                        <h4>Personal Details</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customerName">Full Name *</label>
                                <input type="text" id="customerName" name="customerName" required placeholder="Enter your full name">
                            </div>
                            <div class="form-group">
                                <label for="customerEmail">Email Address *</label>
                                <input type="email" id="customerEmail" name="customerEmail" required placeholder="your.email@example.com">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="customerPhone">Phone Number *</label>
                                <input type="tel" id="customerPhone" name="customerPhone" required placeholder="10-digit mobile number">
                            </div>
                            <div class="form-group">
                                <label for="customerCity">City *</label>
                                <input type="text" id="customerCity" name="customerCity" required placeholder="Your city">
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Shipping Address</h4>
                        <div class="form-group">
                            <label for="shippingAddress">Complete Address *</label>
                            <textarea id="shippingAddress" name="shippingAddress" rows="3" required placeholder="House/Flat no, Building, Street, Area"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="pincode">Pincode *</label>
                                <input type="text" id="pincode" name="pincode" required placeholder="6-digit pincode" maxlength="6">
                            </div>
                            <div class="form-group">
                                <label for="state">State *</label>
                                <input type="text" id="state" name="state" required placeholder="Your state">
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Additional Information</h4>
                        <div class="form-group">
                            <label for="specialInstructions">Special Instructions (Optional)</label>
                            <textarea id="specialInstructions" name="specialInstructions" rows="2" placeholder="Any special requirements or delivery instructions"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="howFound">How did you find us? (Optional)</label>
                            <select id="howFound" name="howFound">
                                <option value="">Select an option</option>
                                <option value="Google Search">Google Search</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Friend Referral">Friend Referral</option>
                                <option value="Advertisement">Advertisement</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        <div class="order-items">
                            ${cart.map(item => `
                                <div class="order-item">
                                    <span>${item.name} (Qty: ${item.quantity})</span>
                                    <span>₹${item.price * item.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-breakdown">
                            <div class="breakdown-row">
                                <span>Subtotal:</span>
                                <span>₹${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                            </div>
                            <div class="breakdown-row">
                                <span>Convenience Fee:</span>
                                <span>₹50</span>
                            </div>
                            <div class="breakdown-row total">
                                <strong>Total Amount:</strong>
                                <strong>₹${cartTotal}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="back-to-cart-btn" onclick="closeCustomerForm()">BACK TO CART</button>
                        <button type="submit" class="submit-order-btn">CONFIRM ORDER</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', customerFormHTML);

    const customerModal = document.getElementById('customerFormModal');
    const closeModal = document.querySelector('.close-order-modal');
    const customerForm = document.getElementById('customerInfoForm');

    setTimeout(() => customerModal.style.display = 'block', 100);

    closeModal.addEventListener('click', closeCustomerForm);
    overlay.addEventListener('click', closeCustomerForm);

    // Submit form event listener
    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCustomerForm(this)) {
            submitOrderToGoogleSheets(this);
        }
    });

    addFormValidation();
}

function closeCustomerForm() {
    const customerModal = document.getElementById('customerFormModal');
    if (customerModal) customerModal.remove();
}

function addFormValidation() {
    const phoneInput = document.getElementById('customerPhone');
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    const pincodeInput = document.getElementById('pincode');
    pincodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
}

function validateCustomerForm(form) {
    const formData = new FormData(form);
    const phone = formData.get('customerPhone');
    const pincode = formData.get('pincode');

    if (phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    if (pincode.length !== 6) {
        alert('Please enter a valid 6-digit pincode');
        return false;
    }
    return true;
}

// Google Apps Script submission
function submitOrderToGoogleSheets(form) {
  const formData = new FormData(form);
  const orderData = {
    orderId: generateOrderId(),
    timestamp: new Date().toISOString(),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    customerPhone: formData.get('customerPhone'),
    customerCity: formData.get('customerCity'),
    shippingAddress: formData.get('shippingAddress'),
    pincode: formData.get('pincode'),
    state: formData.get('state'),
    specialInstructions: formData.get('specialInstructions'),
    howFound: formData.get('howFound'),
    totalAmount: cartTotal,
    totalItems: cart.reduce((total, item) => total + item.quantity, 0),
    items: cart.map(item => ({
      id: item.id,
      brand: item.brand,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }))
  };

  const submitBtn = form.querySelector('.submit-order-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'PROCESSING ORDER...';
  submitBtn.disabled = true;

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      showOrderSuccess(orderData);
      cart = [];
      updateCartUI();
      updateProductButtons();
      closeCartSidebar();
      closeCustomerForm();
    } else {
      throw new Error(data.message || 'Unknown error');
    }
  })
  .catch(error => {
    alert('Order failed: ' + error.message);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}


function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`;
}

function showOrderSuccess(orderData) {
    const successHTML = `
        <div class="order-success-modal">
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Order Placed Successfully!</h3>
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                    <p><strong>Customer:</strong> ${orderData.customerName}</p>
                    <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
                    <p><strong>Email:</strong> ${orderData.customerEmail}</p>
                    <p><strong>Shipping to:</strong> ${orderData.shippingAddress}, ${orderData.customerCity} - ${orderData.pincode}</p>
                    <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
                </div>
                <p class="success-message">Thank you for your order! We will contact you shortly to confirm the details.</p>
                <button class="continue-shopping-btn" onclick="closeSuccessModal()">CONTINUE SHOPPING</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function closeSuccessModal() {
    const successModal = document.querySelector('.order-success-modal');
    if (successModal) successModal.remove();
}

// Hero Slider Functionality
let currentSlide = 0;
let slideInterval;
const SLIDE_DURATION = 4000;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    startSlideshow();

    document.querySelector('.slide-prev').addEventListener('click', prevSlide);
    document.querySelector('.slide-next').addEventListener('click', nextSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    const heroSlider = document.querySelector('.hero-slider');
    heroSlider.addEventListener('mouseenter', pauseSlideshow);
    heroSlider.addEventListener('mouseleave', startSlideshow);
    heroSlider.addEventListener('touchstart', pauseSlideshow);
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');
    currentSlide = slideIndex;
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    goToSlide((currentSlide + 1) % slides.length);
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

