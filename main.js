// إعدادات Firebase (سيتم استبدالها ببيانات حقيقية من قبل المستخدم أو استخدام محاكاة للتطوير)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "alafraa-store.firebaseapp.com",
    projectId: "alafraa-store",
    storageBucket: "alafraa-store.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

// محاكاة بيانات المنتجات في حال عدم وجود Firebase حالياً
let products = JSON.parse(localStorage.getItem('alafraa_products')) || [
    { id: 1, name: "فستان سهرة ملكي", price: 1200, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80", desc: "فستان فخم من الحرير الطبيعي مع تطريزات ذهبية" },
    { id: 2, name: "طقم مجوهرات ذهبي", price: 2500, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80", desc: "طقم مرصع بأحجار كريمة أصلية" },
    { id: 3, name: "حقيبة يد جلدية", price: 850, image: "https://images.unsplash.com/photo-1584917033904-493bb3c39d84?auto=format&fit=crop&w=500&q=80", desc: "حقيبة مصنوعة يدوياً من الجلد الإيطالي" },
    { id: 4, name: "عطر العفراء الفاخر", price: 450, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80", desc: "عطر شرقي فاخر برائحة الورد والعود" },
    { id: 5, name: "شال حرير ملون", price: 320, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80", desc: "شال من الحرير الخالص بألوان ناعمة" },
    { id: 6, name: "حذاء سهرة ذهبي", price: 680, image: "https://images.unsplash.com/photo-1543163521-9efb8fdd3539?auto=format&fit=crop&w=500&q=80", desc: "حذاء سهرة بكعب عالي مريح" }
];

// دالة عرض المنتجات
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(product => {
        const card = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price} ر.س</p>
                    <button class="btn-luxury" onclick="addToCart(${product.id})">إضافة للسلة</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// دالة إضافة للسلة (تجربة مستخدم)
function addToCart(id) {
    let cartCount = parseInt(document.getElementById('cart-count').innerText);
    document.getElementById('cart-count').innerText = ++cartCount;
    
    // تأثير بصري
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 300);
    
    // إشعار
    showNotification('تمت إضافة المنتج للسلة بنجاح!');
}

// دالة الإشعارات
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position: fixed; top: 100px; right: 20px; background: var(--primary-color); padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 3000; animation: slideIn 0.3s ease;';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// تشغيل الوظائف عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // تأثيرات التمرير (Scroll Reveal)
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.padding = '10px 10%';
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.padding = '20px 10%';
            nav.style.background = '#ffffff';
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });
    
    // إضافة تأثير الظهور للمنتجات
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease';
            }
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
});
