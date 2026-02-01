// إدارة متجر العفراء - لوحة التحكم
const productForm = document.getElementById('add-product-form');
const productsList = document.getElementById('admin-products-list');
const chatsList = document.getElementById('admin-chats-list');

let products = JSON.parse(localStorage.getItem('alafraa_products')) || [];

// إضافة منتج
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: document.getElementById('p-price').value,
        image: document.getElementById('p-image').value,
        desc: document.getElementById('p-desc').value
    };
    
    products.push(newProduct);
    localStorage.setItem('alafraa_products', JSON.stringify(products));
    renderAdminProducts();
    productForm.reset();
    showAdminNotification('تمت إضافة المنتج بنجاح');
});

// عرض المنتجات في لوحة التحكم
function renderAdminProducts() {
    productsList.innerHTML = '';
    if (products.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: #999;">لا توجد منتجات حتى الآن</p>';
        return;
    }
    
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div style="flex-grow: 1;">
                <strong>${p.name}</strong>
                <p style="color: #666; font-size: 0.9rem;">${p.desc}</p>
                <span style="color: var(--accent-color); font-weight: 700;">${p.price} ر.س</span>
            </div>
            <button onclick="editProduct(${p.id})" style="background: var(--primary-color); margin-left: 10px;">تعديل</button>
            <button onclick="deleteProduct(${p.id})" style="background: #ffcccc; color: red;">حذف</button>
        `;
        productsList.appendChild(div);
    });
}

window.deleteProduct = function(id) {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('alafraa_products', JSON.stringify(products));
        renderAdminProducts();
        showAdminNotification('تم حذف المنتج');
    }
};

window.editProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('p-name').value = product.name;
        document.getElementById('p-price').value = product.price;
        document.getElementById('p-image').value = product.image;
        document.getElementById('p-desc').value = product.desc;
        
        // تغيير زر الإرسال لتعديل
        const btn = productForm.querySelector('button');
        btn.textContent = 'تحديث المنتج';
        
        productForm.onsubmit = (e) => {
            e.preventDefault();
            product.name = document.getElementById('p-name').value;
            product.price = document.getElementById('p-price').value;
            product.image = document.getElementById('p-image').value;
            product.desc = document.getElementById('p-desc').value;
            
            localStorage.setItem('alafraa_products', JSON.stringify(products));
            renderAdminProducts();
            productForm.reset();
            btn.textContent = 'إضافة المنتج';
            productForm.onsubmit = null;
            showAdminNotification('تم تحديث المنتج');
        };
    }
};

// عرض المحادثات
function renderAdminChats() {
    chatsList.innerHTML = '';
    let hasChats = false;
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('msgs_')) {
            hasChats = true;
            const username = key.replace('msgs_', '');
            const msgs = JSON.parse(localStorage.getItem(key)) || [];
            const unreadCount = msgs.filter(m => m.type === 'sent').length;
            
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div style="flex-grow: 1;">
                    <strong>${username}</strong>
                    <p style="color: #666; font-size: 0.9rem;">${msgs.length} رسالة</p>
                </div>
                <button onclick="openChat('${username}')" class="btn-luxury">رد</button>
            `;
            chatsList.appendChild(div);
        }
    }
    
    if (!hasChats) {
        chatsList.innerHTML = '<p style="text-align: center; color: #999;">لا توجد محادثات حتى الآن</p>';
    }
}

window.openChat = function(username) {
    const adminChatWindow = document.getElementById('admin-chat-window');
    const adminChatMessages = document.getElementById('admin-chat-messages');
    adminChatWindow.classList.remove('hidden');
    
    const msgs = JSON.parse(localStorage.getItem(`msgs_${username}`)) || [];
    adminChatMessages.innerHTML = '';
    msgs.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg ${msg.type === 'sent' ? 'msg-received' : 'msg-sent'}`;
        div.innerHTML = `<strong>${msg.sender}:</strong> <p>${msg.text}</p><small>${msg.time}</small>`;
        adminChatMessages.appendChild(div);
    });
    
    adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
    
    // حفظ اسم المستخدم الحالي للرد
    window.currentChatUser = username;
};

// الرد من قبل المشرف
document.getElementById('admin-send-btn').addEventListener('click', () => {
    const input = document.getElementById('admin-chat-input');
    const text = input.value.trim();
    if (!text || !window.currentChatUser) return;

    const reply = {
        sender: 'المشرف',
        text: text,
        time: new Date().toLocaleTimeString(),
        type: 'received'
    };

    const msgs = JSON.parse(localStorage.getItem(`msgs_${window.currentChatUser}`)) || [];
    msgs.push(reply);
    localStorage.setItem(`msgs_${window.currentChatUser}`, JSON.stringify(msgs));
    
    input.value = '';
    openChat(window.currentChatUser);
    showAdminNotification('تم إرسال الرد');
});

// إشعار المشرف
function showAdminNotification(msg) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--accent-color); color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 3000; animation: slideIn 0.3s ease;';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// التشغيل عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    renderAdminProducts();
    renderAdminChats();
    
    // تحديث قائمة المحادثات كل 5 ثواني
    setInterval(renderAdminChats, 5000);
});
