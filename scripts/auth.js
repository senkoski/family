document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily'));

    if (!currentUser || !currentFamily) {
        window.location.href = 'login.html';
        return;
    }

    // Update user info in navbar
    const userName = document.getElementById('user-name');
    userName.textContent = currentUser.email.split('@')[0];

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        // Clear user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentFamily');
        
        // Clear all family data
        localStorage.removeItem('transactions');
        localStorage.removeItem('kids');
        localStorage.removeItem('settings');
        
        // Redirect to login
        window.location.href = 'login.html';
    });

    // Update currency format
    function formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    // Update all currency displays
    const currencyElements = document.querySelectorAll('.currency');
    currencyElements.forEach(el => {
        el.textContent = 'R$';
    });

    // Update balance displays
    const balanceElements = document.querySelectorAll('.balance-amount, .balance-item span:not(.label)');
    balanceElements.forEach(el => {
        const amount = parseFloat(el.textContent.replace(/[^\d.-]+/g, ''));
        if (!isNaN(amount)) {
            el.textContent = formatCurrency(amount);
        }
    });

    // Add family code to page title
    document.title = `Gerenciador Financeiro Familiar - Família ${currentFamily.code}`;
});
