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
let currentImageSlider = {
    currentIndex: 0,
    images: [],
    container: null,
    dotsContainer: null
};
let selectedSize = null;

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
const sizeSection = document.getElementById('sizeSection');
const sizeButtons = document.getElementById('sizeButtons');
const sizeError = document.getElementById('sizeError');

// Product details data - UPDATED WITH SIZE AVAILABILITY
const productDetails = {
    // Saree Category (1-5) - No sizes needed
    1: {
        id: 1,
        name: "Hand Battik Saree",
        brand: "Amilis",
        price: 1500,
        originalPrice: 2000,
        images: [
            "./image1/saree/Hand Battik saree.jpeg",
        ],
        description: "Beautiful handcrafted Batik saree with traditional wax-resist dyeing techniques. Each piece features unique patterns and vibrant colors, perfect for festive occasions.",
        features: [
            "Handcrafted Batik design",
            "Traditional wax-resist technique",
            "Vibrant colors and patterns",
            "Comfortable cotton fabric",
            "Perfect for festive occasions"
        ],
        specifications: {
            "Material": "Pure Cotton",
            "Length": "5.5 meters",
            "Width": "1.2 meters",
            "Weight": "800 grams",
            "Care": "Dry clean recommended"
        },
        hasSizes: false
    },
    2: {
        id: 2,
        name: "Kalamkari Saree",
        brand: "Amilis",
        price: 800,
        originalPrice: 1200,
        images: [
            "./image1/saree/KalamkariSare.jpeg",

        ],
        description: "Exquisite Kalamkari saree featuring traditional hand-painted motifs inspired by nature and mythology. Made with natural dyes on pure cotton fabric.",
        features: [
            "Hand-painted Kalamkari art",
            "Natural vegetable dyes",
            "Traditional motifs and patterns",
            "Pure cotton fabric",
            "Lightweight and comfortable"
        ],
        specifications: {
            "Material": "Pure Cotton",
            "Length": "6 meters",
            "Width": "1.1 meters",
            "Weight": "750 grams",
            "Care": "Hand wash in cold water"
        },
        hasSizes: false
    },
    3: {
        id: 3,
        name: "Kantha Stitch Saree",
        brand: "Amilis",
        price: 7500,
        originalPrice: 8000,
        images: [
            "./image1/saree/Kanthastic.jpeg",
        ],
        description: "Premium Kantha stitch saree featuring intricate hand-embroidered patterns. Traditional Bengali embroidery with delicate motifs on fine fabric.",
        features: [
            "Hand-embroidered Kantha stitch",
            "Traditional Bengali craftsmanship",
            "Intricate folk motifs",
            "Fine cotton-silk blend",
            "Elegant drape and finish"
        ],
        specifications: {
            "Material": "Cotton Silk Blend",
            "Length": "6 meters",
            "Width": "1.2 meters",
            "Weight": "900 grams",
            "Care": "Dry clean only"
        },
        hasSizes: false
    },
    4: {
        id: 4,
        name: "Linen Saree",
        brand: "Amilis",
        price: 1500,
        originalPrice: 2000,
        images: [
            "./image1/saree/LinenSare.jpeg",
        ],
        description: "Elegant linen saree perfect for summer wear. Lightweight, breathable fabric with a crisp texture and sophisticated look.",
        features: [
            "Pure linen fabric",
            "Lightweight and breathable",
            "Perfect for summer",
            "Crisp elegant texture",
            "Sophisticated drape"
        ],
        specifications: {
            "Material": "Pure Linen",
            "Length": "5.5 meters",
            "Width": "1.1 meters",
            "Weight": "700 grams",
            "Care": "Machine wash gentle cycle"
        },
        hasSizes: false
    },
    5: {
        id: 5,
        name: "Khesh Saree",
        brand: "Amilis",
        price: 1200,
        originalPrice: 1500,
        images: [
            "./image1/saree/KheshsantiniketanSare.jpeg",
        ],
        description: "Traditional Khesh saree from Santiniketan, made using recycled sari strips. Eco-friendly and comfortable for daily wear.",
        features: [
            "Recycled fabric strips",
            "Eco-friendly production",
            "Traditional Santiniketan craft",
            "Light and airy texture",
            "Perfect for daily wear"
        ],
        specifications: {
            "Material": "Recycled Cotton",
            "Length": "5 meters",
            "Width": "1 meter",
            "Weight": "600 grams",
            "Care": "Hand wash mild detergent"
        },
        hasSizes: false
    },

    // T-Shirts Category (201) - Has sizes
    201: {
        id: 201,
        name: "Customized Hand Printed T-Shirt",
        brand: "Amilis",
        price: 499,
        originalPrice: 999,
        images: [
            "./image1/T-shirt Section/CustomizedT-shir.jpeg",
        ],
        description: "Customized hand-printed cotton T-shirt with unique designs available in both English and Bengali scripts. Perfect for gifting and personal style.",
        features: [
            "Custom hand printing",
            "Available in English & Bengali",
            "100% premium cotton",
            "Comfortable daily wear",
            "Perfect for gifting"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Fit": "Regular Fit",
            "Colors": "Multiple options",
            "Sizes": "S, M, L, XL",
            "Care": "Machine wash cold"
        },
        hasSizes: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        availableSizes: ["S", "M", "L", "XL"]
    },

    // Woolen Category (401-410) - Winter Collection - Has sizes
    401: {
        id: 401,
        name: "Insulated Jacket (unisex)",
        brand: "WoolCraft",
        price: 2499,
        originalPrice: 3124,
        images: [
            "./image1/Winter Section/InsulatedJacketme.jpeg",
            "./image1/Winter Section/InsulatedJacketwome.jpeg",
        ],
        description: "Premium insulated men's jacket for extreme winter conditions. Features thermal lining and waterproof exterior.",
        features: [
            "Premium insulation",
            "Waterproof exterior",
            "Thermal lining",
            "Multiple pockets",
            "Adjustable hood"
        ],
        specifications: {
            "Material": "Polyester Blend",
            "Insulation": "Thermal",
            "Size": "M, L, XL, XXL",
            "Color": "Black",
            "Care": "Machine wash gentle"
        },
        hasSizes: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        availableSizes: ["M", "L", "XL", "XXL"]
    },
    402: {
        id: 402,
        name: "Woolen Sweater",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/Insulated Jacket(women).png",
            "./image1/Winter Section/Insulated Jacket(women).png",
        ],
        description: "Stylish insulated women's jacket with slim fit design. Perfect for cold weather with excellent warmth retention.",
        features: [
            "Slim fit design",
            "Premium insulation",
            "Wind resistant",
            "Fashionable colors",
            "Comfortable lining"
        ],
        specifications: {
            "Material": "Nylon Blend",
            "Fit": "Slim Fit",
            "Size": "S, M, L",
            "Color": "Various",
            "Care": "Machine wash cold"
        },
        hasSizes: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        availableSizes: ["S", "M", "L"]
    },
    403: {
        id: 403,
        name: "Kashmiri shawl",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/KashmiriSaulMe.jpeg",
            "./image1/Winter Section/KashmiriSaulwome.jpeg",
        ],
        description: "Authentic Kashmiri wool shawl for men with traditional embroidery. Handcrafted by skilled artisans.",
        features: [
            "Pure Kashmiri wool",
            "Hand embroidery",
            "Traditional patterns",
            "Premium warmth",
            "Elegant design"
        ],
        specifications: {
            "Material": "Pure Wool",
            "Dimensions": "2 x 1 meters",
            "Weight": "500 grams",
            "Color": "Traditional",
            "Care": "Dry clean only"
        },
        hasSizes: true,
        sizes: ["One Size", "L", "XL"],
        availableSizes: ["One Size", "L", "XL"]
    },
    404: {
        id: 404,
        name: "Woolen Sweater",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./images/Winter Section/Kashmiri Saul(women).png",
            "./images/Winter Section/Kashmiri Saul(women).png",
            "./images/Winter Section/Kashmiri Saul(women).png"
        ],
        description: "Beautiful Kashmiri wool shawl for women with intricate embroidery and delicate patterns.",
        features: [
            "Fine wool fabric",
            "Intricate embroidery",
            "Delicate patterns",
            "Lightweight warmth",
            "Elegant drape"
        ],
        specifications: {
            "Material": "Fine Wool",
            "Dimensions": "2.2 x 1.1 meters",
            "Weight": "450 grams",
            "Color": "Feminine colors",
            "Care": "Dry clean only"
        },
        hasSizes: true,
        sizes: ["One Size", "S", "M"],
        availableSizes: ["One Size", "S", "M"]
    },
    405: {
        id: 405,
        name: "Woolen Sweater",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/marinowoolme.jpeg",
            "./image1/Winter Section/merinowoolwome.jpeg",
        ],
        description: "Premium merino wool sweater for men. Soft, warm, and perfect for cold winter days.",
        features: [
            "Premium merino wool",
            "Soft and warm",
            "Comfortable fit",
            "Breathable fabric",
            "Classic design"
        ],
        specifications: {
            "Material": "Merino Wool",
            "Fit": "Regular Fit",
            "Size": "M, L, XL",
            "Color": "Solid colors",
            "Care": "Hand wash"
        },
        hasSizes: true,
        sizes: ["S", "M", "L", "XL"],
        availableSizes: ["M", "L", "XL"]
    },
    406: {
        id: 406,
        name: "Woolen Sweater",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./images/Winter Section/merino wool (women).png",
            "./images/Winter Section/merino wool (women).png",
            "./images/Winter Section/merino wool (women).png"
        ],
        description: "Elegant merino wool sweater for women with fashionable design and excellent warmth.",
        features: [
            "Fine merino wool",
            "Fashionable design",
            "Excellent warmth",
            "Soft texture",
            "Versatile style"
        ],
        specifications: {
            "Material": "Merino Wool",
            "Fit": "Fitted",
            "Size": "S, M, L",
            "Color": "Pastel shades",
            "Care": "Hand wash"
        },
        hasSizes: true,
        sizes: ["XS", "S", "M", "L"],
        availableSizes: ["S", "M", "L"]
    },
    407: {
        id: 407,
        name: "Leather Jacket",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/revarsivalleatherjacketme.jpeg",
            "./image1/Winter Section/revarsivalleatherjacketwome.jpeg",
        ],
        description: "Stylish leather jacket for men with retro design. Perfect for winter fashion and casual wear.",
        features: [
            "Premium leather",
            "Retro design",
            "Warm lining",
            "Multiple pockets",
            "Stylish look"
        ],
        specifications: {
            "Material": "Genuine Leather",
            "Fit": "Regular Fit",
            "Size": "M, L, XL",
            "Color": "Brown/Black",
            "Care": "Leather care"
        },
        hasSizes: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        availableSizes: ["M", "L", "XL"]
    },
    408: {
        id: 408,
        name: "Woolen Sweater",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./images/Winter Section/revarsival leather jacket(women).png",
            "./images/Winter Section/revarsival leather jacket(women).png",
            "./images/Winter Section/revarsival leather jacket(women).png"
        ],
        description: "Fashionable leather jacket for women with modern design and comfortable fit.",
        features: [
            "Quality leather",
            "Modern design",
            "Comfortable fit",
            "Stylish details",
            "Warm lining"
        ],
        specifications: {
            "Material": "Genuine Leather",
            "Fit": "Slim Fit",
            "Size": "S, M, L",
            "Color": "Various",
            "Care": "Leather care"
        },
        hasSizes: true,
        sizes: ["XS", "S", "M", "L"],
        availableSizes: ["S", "M", "L"]
    },
    409: {
        id: 409,
        name: "Long over coat (unisex)",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/WinterLongoverCoatwome.jpeg",
            "./image1/Winter Section/WinterLongoverCoatme.jpeg"
        ],
        description: "Long winter overcoat for men with premium wool blend fabric. Perfect for formal winter occasions.",
        features: [
            "Wool blend fabric",
            "Long length design",
            "Formal style",
            "Warm lining",
            "Classic buttons"
        ],
        specifications: {
            "Material": "Wool Blend",
            "Length": "Long",
            "Size": "M, L, XL",
            "Color": "Classic colors",
            "Care": "Dry clean"
        },
        hasSizes: true,
        sizes: ["M", "L", "XL", "XXL"],
        availableSizes: ["M", "L", "XL"]
    },
    410: {
        id: 410,
        name: "Long Over coat (unisex)",
        brand: "WoolCraft",
        price: 1899,
        originalPrice: 2234,
        images: [
            "./image1/Winter Section/WinterLongoverCoatwome.jpeg",
            "./image1/Winter Section/WinterLongoverCoatme.jpeg",
        ],
        description: "Elegant long winter overcoat for women with fashionable design and premium fabric.",
        features: [
            "Premium fabric",
            "Elegant design",
            "Warm and cozy",
            "Fashionable cut",
            "Comfortable fit"
        ],
        specifications: {
            "Material": "Wool Blend",
            "Length": "Long",
            "Size": "S, M, L",
            "Color": "Elegant colors",
            "Care": "Dry clean"
        },
        hasSizes: true,
        sizes: ["XS", "S", "M", "L"],
        availableSizes: ["S", "M", "L"]
    },

    // Candle Category (501-510) - No sizes needed
    501: {
        id: 501,
        name: "Marvel Candles",
        brand: "CandleArt",
        price: 399,
        originalPrice: 570,
        images: [
            "./images/Candle Photos/IMG1.jpg",
            "./images/Candle Photos/IMG1.jpg",
            "./images/Candle Photos/IMG1.jpg"
        ],
        description: "Decorative candle featuring Marvel superhero designs. Perfect for fans and as unique gifts.",
        features: [
            "Marvel superhero designs",
            "Decorative collectible",
            "Long burning time",
            "Mild pleasant scent",
            "Perfect for gifting"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "20-25 hours",
            "Height": "3 inches",
            "Diameter": "3 inches",
            "Scent": "Mild"
        },
        hasSizes: false
    },
    502: {
        id: 502,
        name: "Floral Scented Candle",
        brand: "CandleArt",
        price: 349,
        originalPrice: 465,
        images: [
            "./images/Candle Photos/IMG2.png",
            "./images/Candle Photos/IMG2.png",
            "./images/Candle Photos/IMG2.png"
        ],
        description: "Beautiful floral scented candle that fills your space with relaxing fragrance. Hand-poured with care.",
        features: [
            "Floral fragrance",
            "Hand-poured",
            "Natural essential oils",
            "Relaxing ambiance",
            "Elegant design"
        ],
        specifications: {
            "Material": "Soy Wax",
            "Burn Time": "15-20 hours",
            "Fragrance": "Lavender/Rose",
            "Height": "2.5 inches",
            "Diameter": "2.5 inches"
        },
        hasSizes: false
    },
    503: {
        id: 503,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG3.png",
            "./images/Candle Photos/IMG3.png",
            "./images/Candle Photos/IMG3.png"
        ],
        description: "Set of decorative tea lights perfect for creating warm ambiance. Beautiful designs for any occasion.",
        features: [
            "Set of decorative lights",
            "Creates warm ambiance",
            "Beautiful designs",
            "Long-lasting burn",
            "Perfect for events"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "4-5 hours each",
            "Quantity": "6 pieces",
            "Fragrance": "Unscented",
            "Colors": "Multiple"
        },
        hasSizes: false
    },
    504: {
        id: 504,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG4.png",
            "./images/Candle Photos/IMG4.png",
            "./images/Candle Photos/IMG4.png"
        ],
        description: "Modern geometric pattern candle with contemporary design. Adds style to any room decor.",
        features: [
            "Geometric patterns",
            "Modern design",
            "Contemporary style",
            "Clean burning",
            "Room decor"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "15-18 hours",
            "Design": "Geometric",
            "Height": "3 inches",
            "Diameter": "2.8 inches"
        },
        hasSizes: false
    },
    505: {
        id: 505,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG5.png",
            "./images/Candle Photos/IMG5.png",
            "./images/Candle Photos/IMG5.png"
        ],
        description: "Nature-inspired decorative candle with organic patterns. Brings natural beauty to your space.",
        features: [
            "Nature-inspired design",
            "Organic patterns",
            "Natural aesthetics",
            "Pleasant scent",
            "Eco-friendly"
        ],
        specifications: {
            "Material": "Soy Wax",
            "Burn Time": "12-15 hours",
            "Fragrance": "Natural",
            "Height": "2.8 inches",
            "Diameter": "2.5 inches"
        },
        hasSizes: false
    },
    506: {
        id: 506,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG 6.png",
            "./images/Candle Photos/IMG 6.png",
            "./images/Candle Photos/IMG 6.png"
        ],
        description: "Artistic decorative candle with unique handcrafted designs. A piece of art that illuminates.",
        features: [
            "Artistic design",
            "Handcrafted",
            "Unique patterns",
            "Creative expression",
            "Decorative piece"
        ],
        specifications: {
            "Material": "Beeswax Blend",
            "Burn Time": "10-12 hours",
            "Design": "Artistic",
            "Height": "3.2 inches",
            "Diameter": "2.7 inches"
        },
        hasSizes: false
    },
    507: {
        id: 507,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG 7.png",
            "./images/Candle Photos/IMG 7.png",
            "./images/Candle Photos/IMG 7.png"
        ],
        description: "Candle with traditional Indian patterns and motifs. Celecultural heritage through design.",
        features: [
            "Traditional patterns",
            "Indian motifs",
            "Cultural heritage",
            "Festive design",
            "Celebratory"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "14-16 hours",
            "Pattern": "Traditional",
            "Height": "3 inches",
            "Diameter": "2.5 inches"
        },
        hasSizes: false
    },
    508: {
        id: 508,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG 8.png",
            "./images/Candle Photos/IMG 8.png",
            "./images/Candle Photos/IMG 8.png"
        ],
        description: "Elegant white candle with sophisticated design. Perfect for formal settings and special occasions.",
        features: [
            "Elegant white design",
            "Sophisticated look",
            "Formal occasions",
            "Clean aesthetic",
            "Versatile decor"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "18-20 hours",
            "Color": "Pure White",
            "Height": "3.5 inches",
            "Diameter": "2.5 inches"
        },
        hasSizes: false
    },
    509: {
        id: 509,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG 9.png",
            "./images/Candle Photos/IMG 9.png",
            "./images/Candle Photos/IMG 9.png"
        ],
        description: "Colorful festive candle perfect for celebrations and parties. Brightens up any occasion.",
        features: [
            "Colorful design",
            "Festive appeal",
            "Party decoration",
            "Bright colors",
            "Celebration themed"
        ],
        specifications: {
            "Material": "Paraffin Wax",
            "Burn Time": "12-14 hours",
            "Colors": "Multicolor",
            "Height": "2.8 inches",
            "Diameter": "2.6 inches"
        },
        hasSizes: false
    },
    510: {
        id: 510,
        name: "Decorative Tea Light",
        brand: "CandleArt",
        price: 299,
        originalPrice: 499,
        images: [
            "./images/Candle Photos/IMG 10.png",
            "./images/Candle Photos/IMG 10.png",
            "./images/Candle Photos/IMG 10.png"
        ],
        description: "Special edition decorative candle with exclusive design. Limited availability collectible.",
        features: [
            "Special edition",
            "Exclusive design",
            "Limited availability",
            "Collectible item",
            "Unique gift"
        ],
        specifications: {
            "Material": "Premium Wax",
            "Burn Time": "20-22 hours",
            "Edition": "Special",
            "Height": "3.3 inches",
            "Diameter": "2.8 inches"
        },
        hasSizes: false
    },

    // Home Decor Category (601-603) - No sizes needed
    601: {
        id: 601,
        name: "Wall Art Decor",
        brand: "HomeStyle",
        price: 1299,
        originalPrice: 1624,
        images: [
            "./images/Home Decor/Hand printed Bedsets Cotton.png",
            "./images/Home Decor/Hand printed Bedsets Cotton.png",
            "./images/Home Decor/Hand printed Bedsets Cotton.png"
        ],
        description: "Beautiful hand-printed cotton bedsheets with traditional designs. Adds ethnic charm to your bedroom.",
        features: [
            "Hand-printed design",
            "Pure cotton fabric",
            "Traditional patterns",
            "Comfortable sleep",
            "Easy maintenance"
        ],
        specifications: {
            "Material": "Pure Cotton",
            "Size": "Queen Size",
            "Set Includes": "Bedsheet + 2 Pillow Covers",
            "Colors": "Traditional",
            "Care": "Machine wash"
        },
        hasSizes: false
    },
    602: {
        id: 602,
        name: "Decorative Vase",
        brand: "HomeStyle",
        price: 899,
        originalPrice: 1199,
        images: [
            "./images/Home Decor/Handmade cushion cover.png",
            "./images/Home Decor/Handmade cushion cover.png",
            "./images/Home Decor/Handmade cushion cover.png"
        ],
        description: "Handmade cushion cover with intricate embroidery and traditional patterns. Enhances home decor.",
        features: [
            "Handmade embroidery",
            "Traditional patterns",
            "Premium fabric",
            "Decorative appeal",
            "Comfortable"
        ],
        specifications: {
            "Material": "Cotton Blend",
            "Size": "18 x 18 inches",
            "Design": "Embroidered",
            "Colors": "Vibrant",
            "Care": "Hand wash"
        },
        hasSizes: false
    },
    603: {
        id: 603,
        name: "Decorative Vase",
        brand: "HomeStyle",
        price: 899,
        originalPrice: 1199,
        images: [
            "./images/Home Decor/wall hanging.png",
            "./images/Home Decor/wall hanging.png",
            "./images/Home Decor/wall hanging.png"
        ],
        description: "Traditional decorative wall hanging with folk art designs. Perfect for living room or entrance decor.",
        features: [
            "Traditional folk art",
            "Wall decoration",
            "Colorful designs",
            "Cultural heritage",
            "Easy to hang"
        ],
        specifications: {
            "Material": "Cotton/Thread",
            "Size": "3 x 2 feet",
            "Design": "Folk Art",
            "Colors": "Bright",
            "Care": "Dry clean"
        },
        hasSizes: false
    },

    // Baby Category (701-705) - Has sizes (age ranges or clothing sizes)
    701: {
        id: 701,
        name: "Baby Soft Toys",
        brand: "BabyCare",
        price: 799,
        originalPrice: 1141,
        images: [
            "./images/Baby Section/Cap.png",
            "./images/Baby Section/Cap.png",
            "./images/Baby Section/Cap.png"
        ],
        description: "Soft and comfortable baby caps made from pure cotton. Perfect for newborn head protection.",
        features: [
            "Pure cotton fabric",
            "Soft and gentle",
            "Newborn protection",
            "Comfortable fit",
            "Cute designs"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Age": "0-6 months",
            "Set Includes": "3 caps",
            "Colors": "Pastel",
            "Care": "Hand wash"
        },
        hasSizes: true,
        sizes: ["0-3 Months", "3-6 Months", "6-12 Months"],
        availableSizes: ["0-3 Months", "3-6 Months"]
    },
    702: {
        id: 702,
        name: "Baby Clothing Set",
        brand: "BabyCare",
        price: 1299,
        originalPrice: 1624,
        images: [
            "./images/Baby Section/New Born Socks.png",
            "./images/Baby Section/New Born Socks.png",
            "./images/Baby Section/New Born Socks.png"
        ],
        description: "Soft cotton socks for newborns. Keeps baby's feet warm and comfortable.",
        features: [
            "Soft cotton socks",
            "Newborn size",
            "Non-slip design",
            "Comfortable fit",
            "Multiple colors"
        ],
        specifications: {
            "Material": "Pure Cotton",
            "Age": "0-3 months",
            "Set Includes": "6 pairs",
            "Colors": "Assorted",
            "Care": "Machine wash gentle"
        },
        hasSizes: true,
        sizes: ["Newborn", "0-3 Months", "3-6 Months"],
        availableSizes: ["Newborn", "0-3 Months"]
    },
    703: {
        id: 703,
        name: "Baby Clothing Set",
        brand: "BabyCare",
        price: 1299,
        originalPrice: 1624,
        images: [
            "./images/Baby Section/Pure Cotton Nappy with cotton top.png",
            "./images/Baby Section/Pure Cotton Nappy with cotton top.png",
            "./images/Baby Section/Pure Cotton Nappy with cotton top.png"
        ],
        description: "Pure cotton nappy set with matching top. Soft, absorbent and comfortable for babies.",
        features: [
            "Pure cotton fabric",
            "Soft and absorbent",
            "Matching top",
            "Comfortable wear",
            "Easy to change"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Age": "0-12 months",
            "Set Includes": "Nappy + Top",
            "Colors": "Baby colors",
            "Care": "Machine wash"
        },
        hasSizes: true,
        sizes: ["Newborn", "0-3M", "3-6M", "6-12M"],
        availableSizes: ["Newborn", "0-3M", "3-6M"]
    },
    704: {
        id: 704,
        name: "Baby Clothing Set",
        brand: "BabyCare",
        price: 1299,
        originalPrice: 1624,
        images: [
            "./images/Baby Section/Pure Cotton White Dress Girls.png",
            "./images/Baby Section/Pure Cotton White Dress Girls.png",
            "./images/Baby Section/Pure Cotton White Dress Girls.png"
        ],
        description: "Beautiful pure cotton white dress for baby girls. Elegant and comfortable for special occasions.",
        features: [
            "Pure white cotton",
            "Elegant design",
            "Special occasions",
            "Comfortable fit",
            "Delicate details"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Age": "0-12 months",
            "Design": "Dress",
            "Colors": "White",
            "Care": "Hand wash"
        },
        hasSizes: true,
        sizes: ["Newborn", "0-3M", "3-6M", "6-9M", "9-12M"],
        availableSizes: ["0-3M", "3-6M", "6-9M"]
    },
    705: {
        id: 705,
        name: "Baby Clothing Set",
        brand: "BabyCare",
        price: 1299,
        originalPrice: 1624,
        images: [
            "./images/Baby Section/Pure cotton wraapers.png",
            "./images/Baby Section/Pure cotton wraapers.png",
            "./images/Baby Section/Pure cotton wraapers.png"
        ],
        description: "Soft pure cotton wrappers for newborns. Perfect for swaddling and keeping baby comfortable.",
        features: [
            "Soft pure cotton",
            "Swaddling wraps",
            "Newborn comfort",
            "Multiple uses",
            "Gentle on skin"
        ],
        specifications: {
            "Material": "100% Cotton",
            "Size": "Large wraps",
            "Quantity": "3 pieces",
            "Colors": "Soft colors",
            "Care": "Machine wash"
        },
        hasSizes: true,
        sizes: ["Small", "Medium", "Large"],
        availableSizes: ["Small", "Medium"]
    }
};

// Buy Now functionality
let currentProductForBuyNow = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCartUI();
    setupSearchFunctionality();
    setupProductCardClick();
});

// Setup product card click functionality
function setupProductCardClick() {
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        
        if (productCard) {
            const isAddToCart = e.target.closest('.add-to-cart');
            const isBuyNow = e.target.closest('.buy-now-btn');
            
            if (!isAddToCart && !isBuyNow) {
                const productId = parseInt(productCard.dataset.id);
                if (productId) {
                    showProductDetails(productId);
                }
            }
        }
    });
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    
    const categoryMap = {
        'saree': 'saree',
        'sarees': 'saree',
        'sari': 'saree',
        't-shirt': 't-shirt',
        't-shirts': 't-shirt',
        'tshirt': 't-shirt',
        'tshirts': 't-shirt',
        'woolen': 'woolen',
        'winter': 'woolen',
        'winter collection': 'woolen',
        'jacket': 'woolen',
        'jackets': 'woolen',
        'sweater': 'woolen',
        'sweaters': 'woolen',
        'shawl': 'woolen',
        'shawls': 'woolen',
        'coat': 'woolen',
        'coats': 'woolen',
        'candle': 'candle',
        'candles': 'candle',
        'candlestick': 'candle',
        'home decor': 'home-decor',
        'home': 'home-decor',
        'decor': 'home-decor',
        'home decoration': 'home-decor',
        'bedsheet': 'home-decor',
        'bedsheets': 'home-decor',
        'cushion': 'home-decor',
        'cushions': 'home-decor',
        'wall hanging': 'home-decor',
        'baby': 'baby',
        'babies': 'baby',
        'infant': 'baby',
        'newborn': 'baby',
        'baby clothes': 'baby',
        'baby wear': 'baby',
        'baby cap': 'baby',
        'baby socks': 'baby',
        'baby dress': 'baby'
    };
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            
            let categoryId = categoryMap[searchTerm];
            
            if (!categoryId) {
                for (const [key, value] of Object.entries(categoryMap)) {
                    if (searchTerm.includes(key)) {
                        categoryId = value;
                        break;
                    }
                }
            }
            
            if (categoryId) {
                const targetSection = document.getElementById(categoryId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    targetSection.style.transition = 'all 0.5s ease';
                    targetSection.style.backgroundColor = '#fff9e6';
                    setTimeout(() => {
                        targetSection.style.backgroundColor = '';
                    }, 2000);
                }
            } else {
                alert('Category not found. Please try searching for: "saree", "t-shirt", "winter collection", "candle", "home decor", or "baby".');
            }
            
            this.value = '';
        }
    });
}

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
        // Size selection buttons
        if (e.target.classList.contains('size-btn') && !e.target.classList.contains('out-of-stock')) {
            const sizeButton = e.target;
            const allSizeButtons = document.querySelectorAll('.size-btn');
            
            // Remove selected class from all buttons
            allSizeButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            sizeButton.classList.add('selected');
            selectedSize = sizeButton.dataset.size;
            sizeError.style.display = 'none';
        }
        
        // Cart item controls - FIXED: Better event delegation
        if (e.target.classList.contains('quantity-btn')) {
            const button = e.target;
            const cartItem = button.closest('.cart-item');
            if (cartItem) {
                const cartId = cartItem.dataset.id;
                const isIncrease = button.classList.contains('increase');
                updateCartItemQuantity(cartId, isIncrease);
            }
        }
        
        // Remove item from cart - FIXED: Better event delegation
        if (e.target.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const cartId = cartItem.dataset.id;
                removeFromCart(cartId);
            }
        }
        
        // Add to Cart button on product cards
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
            e.stopPropagation();
        }
        
        // Buy Now button on product cards
        if (e.target.classList.contains('buy-now-btn') || e.target.closest('.buy-now-btn')) {
            const button = e.target.classList.contains('buy-now-btn') ? e.target : e.target.closest('.buy-now-btn');
            const productId = parseInt(button.dataset.id);
            buyNowProduct(productId);
            e.stopPropagation();
        }
        
        // Buy Now button in product modal
        if (e.target.classList.contains('buy-now-btn-modal') || e.target.closest('.buy-now-btn-modal')) {
            if (currentProductId) {
                buyNowProduct(currentProductId);
            }
            e.stopPropagation();
        }
        
        // Image slider controls
        if (e.target.closest('.slider-prev')) {
            prevImage();
            e.stopPropagation();
        }
        
        if (e.target.closest('.slider-next')) {
            nextImage();
            e.stopPropagation();
        }
        
        if (e.target.classList.contains('slider-dot')) {
            const dotIndex = parseInt(e.target.dataset.index);
            goToImage(dotIndex);
            e.stopPropagation();
        }
    });
}

// Image slider functions
function initImageSlider(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
        console.error('No images provided for slider');
        return;
    }
    
    currentImageSlider.images = images;
    currentImageSlider.currentIndex = 0;
    currentImageSlider.container = document.getElementById('sliderContainer');
    currentImageSlider.dotsContainer = document.getElementById('sliderDots');
    
    currentImageSlider.container.innerHTML = '';
    currentImageSlider.dotsContainer.innerHTML = '';
    
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slider-slide';
        slide.innerHTML = `<img src="${image}" alt="Product Image ${index + 1}" onerror="this.src='./images/placeholder.jpg'">`;
        currentImageSlider.container.appendChild(slide);
        
        const dot = document.createElement('span');
        dot.className = 'slider-dot';
        dot.dataset.index = index;
        if (index === 0) dot.classList.add('active');
        currentImageSlider.dotsContainer.appendChild(dot);
    });
    
    updateSliderPosition();
}

function updateSliderPosition() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(-${currentImageSlider.currentIndex * 100}%)`;
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentImageSlider.currentIndex);
    });
}

function nextImage() {
    if (currentImageSlider.images.length > 0) {
        currentImageSlider.currentIndex = (currentImageSlider.currentIndex + 1) % currentImageSlider.images.length;
        updateSliderPosition();
    }
}

function prevImage() {
    if (currentImageSlider.images.length > 0) {
        currentImageSlider.currentIndex = (currentImageSlider.currentIndex - 1 + currentImageSlider.images.length) % currentImageSlider.images.length;
        updateSliderPosition();
    }
}

function goToImage(index) {
    if (index >= 0 && index < currentImageSlider.images.length) {
        currentImageSlider.currentIndex = index;
        updateSliderPosition();
    }
}

// Size selection functions
function setupSizeSelection(product) {
    // Reset selected size
    selectedSize = null;
    sizeButtons.innerHTML = '';
    sizeError.style.display = 'none';
    
    if (product.hasSizes && product.sizes && product.sizes.length > 0) {
        // Show size section
        sizeSection.style.display = 'block';
        
        // Create size buttons
        product.sizes.forEach(size => {
            const sizeButton = document.createElement('button');
            sizeButton.className = 'size-btn';
            sizeButton.dataset.size = size;
            sizeButton.textContent = size;
            
            // Check if size is available
            if (product.availableSizes && product.availableSizes.includes(size)) {
                sizeButton.classList.add('available');
            } else {
                sizeButton.classList.add('out-of-stock');
                sizeButton.title = 'Out of stock';
            }
            
            sizeButtons.appendChild(sizeButton);
        });
    } else {
        // Hide size section for products without sizes
        sizeSection.style.display = 'none';
    }
}

// Cart functions
function addToCart(productId, size = null) {
    const product = getProductData(productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found`);
        return;
    }

    // Check if size is required but not selected
    if (product.hasSizes && !size && !selectedSize) {
        sizeError.style.display = 'inline';
        sizeError.textContent = 'Please select a size';
        return;
    }

    // Use selected size if available
    const selectedProductSize = size || selectedSize;
    
    // Generate a unique cart ID that includes size for products with sizes
    const cartItemId = product.hasSizes ? `${productId}-${selectedProductSize}` : productId.toString();

    const existingItem = cart.find(item => item.cartId === cartItemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            cartId: cartItemId,
            name: product.name,
            price: product.price,
            image: product.images ? product.images[0] : product.image,
            quantity: 1,
            size: product.hasSizes ? selectedProductSize : null,
            hasSizes: product.hasSizes
        });
    }

    updateCartUI();
    showCartNotification();
    
    // Reset selected size for next product
    selectedSize = null;
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function updateCartItemQuantity(cartId, isIncrease) {
    const cartItem = cart.find(item => item.cartId === cartId);
    if (!cartItem) return;

    if (isIncrease) {
        cartItem.quantity += 1;
    } else {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(cartId);
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
            cartItemElement.dataset.id = item.cartId;
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='./images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ''}
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
    if (productDetails[productId]) {
        return productDetails[productId];
    }
    
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!productCard) {
        console.error(`Product card with ID ${productId} not found`);
        return null;
    }

    return {
        id: productId,
        name: productCard.dataset.name || 'Product',
        price: parseInt(productCard.dataset.price) || 0,
        images: [productCard.querySelector('img').src],
        description: productCard.dataset.description || 'No description available',
        features: ['No features listed'],
        specifications: {},
        hasSizes: false
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
            <div class="order-item-details">
                <span>${item.name} (Qty: ${item.quantity})</span>
                ${item.size ? `<span class="order-item-size">Size: ${item.size}</span>` : ''}
            </div>
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
    const product = getProductData(productId);
    if (!product) {
        console.error(`Product details for ID ${productId} not found`);
        alert('Product details not available.');
        return;
    }
    
    currentProductId = productId;
    
    // Initialize image slider with product images
    initImageSlider(product.images || [product.image] || ['./images/placeholder.jpg']);
    
    // Setup size selection if product has sizes
    setupSizeSelection(product);
    
    // Update modal content
    document.getElementById('modalProductBrand').textContent = product.brand || 'Brand';
    document.getElementById('modalProductName').textContent = product.name || 'Product';
    document.getElementById('modalCurrentPrice').textContent = `₹${product.price || 0}`;
    document.getElementById('modalOriginalPrice').textContent = `₹${product.originalPrice || product.price || 0}`;
    
    const discount = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    document.getElementById('modalDiscount').textContent = `${discount}% OFF`;
    
    document.getElementById('modalProductDescription').textContent = product.description || 'No description available.';
    
    // Update features
    const featuresList = document.getElementById('modalFeaturesList');
    featuresList.innerHTML = '';
    if (product.features && product.features.length > 0) {
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No features listed';
        featuresList.appendChild(li);
    }
    
    // Update specifications
    const specifications = document.getElementById('modalSpecifications');
    specifications.innerHTML = '';
    if (product.specifications && Object.keys(product.specifications).length > 0) {
        Object.entries(product.specifications).forEach(([key, value]) => {
            const specRow = document.createElement('div');
            specRow.className = 'spec-row';
            specRow.innerHTML = `
                <span class="spec-key">${key}:</span>
                <span class="spec-value">${value}</span>
            `;
            specifications.appendChild(specRow);
        });
    } else {
        const specRow = document.createElement('div');
        specRow.className = 'spec-row';
        specRow.innerHTML = `
            <span class="spec-key">Details:</span>
            <span class="spec-value">No specifications available</span>
        `;
        specifications.appendChild(specRow);
    }
    
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
    selectedSize = null;
    currentImageSlider = {
        currentIndex: 0,
        images: [],
        container: null,
        dotsContainer: null
    };
}

function addToCartFromModal() {
    if (currentProductId) {
        addToCart(currentProductId);
        closeProductDetails();
    }
}

function showSuccessModal(orderData) {
    const successOrderDetails = document.getElementById('successOrderDetails');
    
    let itemsList = '';
    orderData.items.forEach(item => {
        itemsList += `<p><strong>${item.name}</strong> (Qty: ${item.quantity})${item.size ? ` - Size: ${item.size}` : ''} - ₹${item.price * item.quantity}</p>`;
    });
    
    successOrderDetails.innerHTML = `
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
        <p><strong>Address:</strong> ${orderData.shippingAddress}, ${orderData.customerCity} - ${orderData.pincode}</p>
        <p><strong>Items Ordered:</strong></p>
        ${itemsList}
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
    
    // Clear cart after successful order
    if (currentProductForBuyNow) {
        currentProductForBuyNow = null;
    } else {
        cart = [];
        updateCartUI();
    }
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
            items: [{
                ...currentProductForBuyNow,
                size: currentProductForBuyNow.size || null
            }],
            orderType: 'buy_now'
        };
        
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
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || null
            })),
            orderType: 'cart'
        };
        
        cart = [];
        updateCartUI();
    }
    sendOrderEmail(orderData);
    
    closeCustomerForm();
    showSuccessModal(orderData);
}

function sendOrderEmail(orderData) {
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOfpEasdjZCQMfufGSpYDQtsHHCMtU9F1RyyqWQLsaRyETmua5OmBRn_en-WgdoXEx3w/exec";

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
    const product = getProductData(productId);
    if (!product) return;

    if (product.hasSizes && !selectedSize) {
        sizeError.style.display = 'inline';
        sizeError.textContent = 'Please select a size';
        return;
    }

    // Store the product for buy now
    currentProductForBuyNow = {
        ...product,
        quantity: 1,
        size: product.hasSizes ? selectedSize : null
    };

    // Close product modal if open
    closeProductDetails();
    
    // Show customer form directly
    showCustomerFormForBuyNow();
}

function showCustomerFormForBuyNow() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');

    orderItems.innerHTML = '';
    
    if (currentProductForBuyNow) {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-details">
                <span>${currentProductForBuyNow.name} (Qty: 1)</span>
                ${currentProductForBuyNow.size ? `<span class="order-item-size">Size: ${currentProductForBuyNow.size}</span>` : ''}
            </div>
            <span>₹${currentProductForBuyNow.price}</span>
        `;
        orderItems.appendChild(orderItem);
        
        orderTotal.textContent = currentProductForBuyNow.price;
    }

    customerModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

