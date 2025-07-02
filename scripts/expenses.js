document.addEventListener('DOMContentLoaded', () => {
    // Load data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentFamily = JSON.parse(localStorage.getItem('currentFamily'));
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let members = currentFamily.members || [];

    // Initialize filters
    const categoryFilter = document.getElementById('category-filter');
    const memberFilter = document.getElementById('member-filter');
    const dateFilter = document.getElementById('date-filter');

    // Populate member filters
    populateMemberFilters();

    // Form submission
    const transactionForm = document.getElementById('transaction-form');
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const transaction = {
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value,
            member: document.getElementById('member').value,
            id: Date.now(),
            familyCode: currentFamily.code
        };
        
        transactions.push(transaction);
        saveTransactions(transactions);
        updateTransactionList();
        transactionForm.reset();
    });

    // Filter transactions
    function filterTransactions() {
        const filtered = transactions.filter(transaction => {
            const categoryMatch = !categoryFilter.value || transaction.category === categoryFilter.value;
            const memberMatch = !memberFilter.value || transaction.member === memberFilter.value;
            const dateMatch = !dateFilter.value || 
                transaction.date.startsWith(dateFilter.value);
            return categoryMatch && memberMatch && dateMatch;
        });
        return filtered;
    }

    // Update transaction list
    function updateTransactionList() {
        const container = document.getElementById('transactions');
        const filtered = filterTransactions();
        container.innerHTML = '';
        
        filtered.forEach(transaction => {
            const div = document.createElement('div');
            div.className = `transaction-item ${transaction.category ? 'category-' + transaction.category : 'category-other'}`;
            div.innerHTML = `
                <div class="transaction-category">${getCategoryName(transaction.category)}</div>
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-member">${getMemberName(transaction.member)}</div>
                <div class="transaction-amount">${formatCurrency(transaction.amount)}</div>
                <div class="transaction-date">${new Date(transaction.date).toLocaleDateString('pt-BR')}</div>
                <div class="transaction-actions">
                    <button onclick="editTransaction('${transaction.id}')" class="btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTransaction('${transaction.id}')" class="btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // Helper functions
    function getCategoryName(category) {
        const categories = {
            food: 'Alimentação',
            transport: 'Transporte',
            education: 'Educação',
            entertainment: 'Entretenimento',
            other: 'Outros'
        };
        return categories[category] || 'Outros';
    }

    function getMemberName(memberId) {
        const member = members.find(m => m.id === memberId);
        return member ? member.name : 'Não especificado';
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    function populateMemberFilters() {
        memberFilter.innerHTML = '<option value="">Todos</option>';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            memberFilter.appendChild(option);
        });
    }

    // Save transactions to localStorage
    function saveTransactions(transactions) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
        // Notify other pages of changes
        window.dispatchEvent(new Event('storage'));
    }

    // Event listeners for filters
    categoryFilter.addEventListener('change', updateTransactionList);
    memberFilter.addEventListener('change', updateTransactionList);
    dateFilter.addEventListener('change', updateTransactionList);

    // Update transaction list on page load
    updateTransactionList();
});

// Edit transaction function
function editTransaction(transactionId) {
    const transaction = transactions.find(t => t.id === parseInt(transactionId));
    if (!transaction) return;

    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editar Transação</h2>
            <form id="edit-form">
                <div class="form-group">
                    <label for="edit-amount">Valor</label>
                    <input type="number" id="edit-amount" value="${transaction.amount}" required>
                </div>
                <div class="form-group">
                    <label for="edit-category">Categoria</label>
                    <select id="edit-category" required>
                        <option value="">Selecione uma categoria</option>
                        <option value="food" ${transaction.category === 'food' ? 'selected' : ''}>Alimentação</option>
                        <option value="transport" ${transaction.category === 'transport' ? 'selected' : ''}>Transporte</option>
                        <option value="education" ${transaction.category === 'education' ? 'selected' : ''}>Educação</option>
                        <option value="entertainment" ${transaction.category === 'entertainment' ? 'selected' : ''}>Entretenimento</option>
                        <option value="other" ${transaction.category === 'other' ? 'selected' : ''}>Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-description">Descrição</label>
                    <input type="text" id="edit-description" value="${transaction.description}" required>
                </div>
                <div class="form-group">
                    <label for="edit-date">Data</label>
                    <input type="date" id="edit-date" value="${transaction.date}" required>
                </div>
                <div class="form-group">
                    <label for="edit-member">Membro</label>
                    <select id="edit-member" required>
                        <option value="">Selecione um membro</option>
                        ${members.map(m => `
                            <option value="${m.id}" ${transaction.member === m.id ? 'selected' : ''}>${m.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn-primary">Salvar</button>
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        transaction.amount = parseFloat(document.getElementById('edit-amount').value);
        transaction.category = document.getElementById('edit-category').value;
        transaction.description = document.getElementById('edit-description').value;
        transaction.date = document.getElementById('edit-date').value;
        transaction.member = document.getElementById('edit-member').value;

        saveTransactions(transactions);
        updateTransactionList();
        closeModal();
    });
}

// Delete transaction function
function deleteTransaction(transactionId) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transactions = transactions.filter(t => t.id !== parseInt(transactionId));
        saveTransactions(transactions);
        updateTransactionList();
    }
}

// Close modal function
function closeModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.remove();
    }
}
