// Initialize Chart.js
const ctx = document.getElementById('spendingChart').getContext('2d');

// Load data from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let kids = JSON.parse(localStorage.getItem('kids')) || [];

// Update dashboard
updateDashboard();

// Update dashboard function
function updateDashboard() {
    // Calculate totals
    const totals = calculateTotals();
    
    // Update balance display
    document.getElementById('total-balance').textContent = totals.balance.toFixed(2);
    document.getElementById('total-income').textContent = `$${totals.income.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totals.expenses.toFixed(2)}`;
    
    // Update spending chart
    updateSpendingChart();
    
    // Update recent transactions
    updateRecentTransactions();
}

// Calculate totals
function calculateTotals() {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
        if (transaction.amount > 0) income += transaction.amount;
        else expenses += Math.abs(transaction.amount);
    });
    
    return {
        balance: income - expenses,
        income,
        expenses
    };
}

// Update spending chart
function updateSpendingChart() {
    const categories = {};
    
    transactions.forEach(transaction => {
        if (transaction.amount < 0) {
            const category = transaction.category || 'other';
            categories[category] = (categories[category] || 0) + Math.abs(transaction.amount);
        }
    });
    
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#2196f3',
                    '#4caf50',
                    '#ff9800',
                    '#9c27b0',
                    '#ff5722'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update recent transactions
function updateRecentTransactions() {
    const container = document.getElementById('recent-transactions');
    container.innerHTML = '';
    
    transactions.slice().reverse().forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div>${transaction.description}</div>
            <div class="transaction-amount">$${Math.abs(transaction.amount).toFixed(2)}</div>
            <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
        `;
        container.appendChild(div);
    });
}

// Listen for changes in other pages
window.addEventListener('storage', () => {
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    kids = JSON.parse(localStorage.getItem('kids')) || [];
    updateDashboard();
});
