document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const generateCodeBtn = document.getElementById('generate-code');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const familyCodeInput = document.getElementById('family-code');

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily'));

    if (currentUser && currentFamily) {
        window.location.href = 'index.html';
    }

    // Generate random family code
    generateCodeBtn.addEventListener('click', () => {
        const code = generateFamilyCode();
        familyCodeInput.value = code;
    });

    // Login functionality
    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const familyCode = familyCodeInput.value;

        // Validate inputs
        if (!validateEmail(email)) {
            showAlert('Por favor, insira um e-mail válido.');
            return;
        }

        if (password.length < 6) {
            showAlert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (familyCode.length !== 8) {
            showAlert('O código familiar deve ter 8 caracteres.');
            return;
        }

        // Check if family code exists
        const families = JSON.parse(localStorage.getItem('families')) || {};
        if (!families[familyCode]) {
            // Create new family
            families[familyCode] = {
                code: familyCode,
                members: [],
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('families', JSON.stringify(families));
        }

        // Save user and family data
        const user = {
            email,
            familyCode,
            lastLogin: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentFamily', JSON.stringify(families[familyCode]));

        // Redirect to dashboard
        window.location.href = 'index.html';
    });

    // Forgot password
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAlert('Por favor, contate o administrador da família para redefinir sua senha.');
    });

    // Helper functions
    function generateFamilyCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: #dc3545;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});
