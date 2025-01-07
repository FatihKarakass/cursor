// Kullanıcı girişi
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        updateUI(userCredential.user);
    } catch (error) {
        alert('Giriş başarısız: ' + error.message);
    }
}

// Yeni kullanıcı kaydı
async function register(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await createUserProfile(userCredential.user);
        updateUI(userCredential.user);
    } catch (error) {
        alert('Kayıt başarısız: ' + error.message);
    }
}

// Kullanıcı profili oluştur
async function createUserProfile(user) {
    await database.ref('users/' + user.uid).set({
        email: user.email,
        highScores: {
            flappy: 0,
            dino: 0,
            mario: 0
        },
        createdAt: Date.now()
    });
}

// UI güncelleme
function updateUI(user) {
    if (user) {
        document.getElementById('authModal').style.display = 'none';
        // Kullanıcı bilgilerini göster
        document.querySelector('.user-info').innerHTML = `
            <span>Merhaba, ${user.email}</span>
            <button onclick="auth.signOut()">Çıkış Yap</button>
        `;
    } else {
        document.querySelector('.user-info').innerHTML = `
            <button onclick="showAuthModal()">Giriş Yap</button>
        `;
    }
}

document.getElementById('loginBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
});

document.getElementById('registerBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await register(email, password);
});

// Modal göster/gizle fonksiyonları
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
} 