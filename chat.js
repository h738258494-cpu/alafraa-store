// نظام الشات لمتجر العفراء
const chatWidget = document.getElementById('chat-widget');
const chatAuth = document.getElementById('chat-auth');
const chatMessagesContainer = document.getElementById('chat-messages-container');
const chatLoginBtn = document.getElementById('chat-login-btn');
const sendMsgBtn = document.getElementById('send-msg-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

let currentUser = JSON.parse(localStorage.getItem('alafraa_user')) || null;

// فتح وإغلاق الشات
chatWidget.addEventListener('click', (e) => {
    if (chatWidget.classList.contains('chat-minimized')) {
        chatWidget.classList.remove('chat-minimized');
        chatWidget.style.width = '320px';
        chatWidget.style.height = 'auto';
        checkAuth();
    }
});

document.getElementById('close-chat').addEventListener('click', (e) => {
    e.stopPropagation();
    chatWidget.classList.add('chat-minimized');
    chatWidget.style.width = '150px';
    chatWidget.style.height = '50px';
});

// التحقق من الهوية
function checkAuth() {
    if (currentUser) {
        chatAuth.classList.add('hidden');
        chatMessagesContainer.classList.remove('hidden');
        loadMessages();
    } else {
        chatAuth.classList.remove('hidden');
        chatMessagesContainer.classList.add('hidden');
    }
}

// تسجيل الدخول
chatLoginBtn.addEventListener('click', () => {
    const user = document.getElementById('chat-username').value;
    const pass = document.getElementById('chat-password').value;
    
    if (user && pass) {
        currentUser = { username: user, id: Date.now().toString() };
        localStorage.setItem('alafraa_user', JSON.stringify(currentUser));
        checkAuth();
        
        // رسالة ترحيب
        setTimeout(() => {
            const welcomeMsg = {
                sender: 'العفراء',
                text: 'أهلاً وسهلاً! كيف يمكننا مساعدتك؟',
                time: new Date().toLocaleTimeString(),
                type: 'received'
            };
            renderMessage(welcomeMsg);
            saveMessageToDB(welcomeMsg);
        }, 500);
    } else {
        alert('يرجى إدخال البيانات');
    }
});

// إرسال رسالة
function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const msg = {
        sender: currentUser.username,
        text: text,
        time: new Date().toLocaleTimeString(),
        type: 'sent'
    };

    // حفظ في Firebase (محاكاة هنا، وتعمل فعلياً إذا تم إعداد Firebase)
    saveMessageToDB(msg);
    
    chatInput.value = '';
    renderMessage(msg);
}

sendMsgBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => { 
    if(e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

function renderMessage(msg) {
    const div = document.createElement('div');
    div.className = `msg ${msg.type === 'sent' ? 'msg-sent' : 'msg-received'}`;
    div.innerHTML = `<strong>${msg.sender}:</strong> <p>${msg.text}</p><small>${msg.time}</small>`;
    div.style.animation = 'fadeInUp 0.3s ease';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// محاكاة تحميل الرسائل
function loadMessages() {
    chatMessages.innerHTML = '';
    const savedMsgs = JSON.parse(localStorage.getItem(`msgs_${currentUser.username}`)) || [];
    savedMsgs.forEach(renderMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveMessageToDB(msg) {
    // حفظ محلياً
    const savedMsgs = JSON.parse(localStorage.getItem(`msgs_${currentUser.username}`)) || [];
    savedMsgs.push(msg);
    localStorage.setItem(`msgs_${currentUser.username}`, JSON.stringify(savedMsgs));
    
    // إرسال لـ Firebase إذا كان متاحاً
    if (typeof db !== 'undefined') {
        db.collection("chats").add({
            userId: currentUser.id,
            username: currentUser.username,
            message: msg.text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => console.log('Firebase غير متصل'));
    }
}
