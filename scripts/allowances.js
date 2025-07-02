document.addEventListener('DOMContentLoaded', () => {
    // Load kids from localStorage
    let kids = JSON.parse(localStorage.getItem('kids')) || [];
    
    // Form submission
    const kidForm = document.getElementById('kid-form');
    kidForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const kid = {
            name: document.getElementById('name').value,
            allowance: parseFloat(document.getElementById('allowance').value),
            balance: 0,
            id: Date.now()
        };
        
        kids.push(kid);
        saveKids(kids);
        updateKidProfiles();
        kidForm.reset();
    });
    
    // Update kid profiles
    updateKidProfiles();
    
    // Update kid profiles function
    function updateKidProfiles() {
        const container = document.getElementById('kid-profiles');
        container.innerHTML = '';
        
        kids.forEach(kid => {
            const div = document.createElement('div');
            div.className = 'kid-profile';
            div.innerHTML = `
                <div class="kid-name">${kid.name}</div>
                <div class="kid-allowance">$${kid.allowance.toFixed(2)}/week</div>
                <div class="kid-balance">Balance: $${kid.balance.toFixed(2)}</div>
                <div class="kid-actions">
                    <button class="btn-pay" onclick="payAllowance('${kid.id}')">Pay Allowance</button>
                    <button class="btn-edit" onclick="editKid('${kid.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteKid('${kid.id}')">Delete</button>
                </div>
            `;
            container.appendChild(div);
        });
    }
    
    // Save kids to localStorage
    function saveKids(kids) {
        localStorage.setItem('kids', JSON.stringify(kids));
        // Notify other pages of changes
        window.dispatchEvent(new Event('storage'));
    }
    
    // Pay allowance
    function payAllowance(kidId) {
        const kidIndex = kids.findIndex(k => k.id === parseInt(kidId));
        if (kidIndex !== -1) {
            kids[kidIndex].balance += kids[kidIndex].allowance;
            saveKids(kids);
            updateKidProfiles();
        }
    }
    
    // Edit kid
    function editKid(kidId) {
        const kidIndex = kids.findIndex(k => k.id === parseInt(kidId));
        if (kidIndex !== -1) {
            const kid = kids[kidIndex];
            const newName = prompt('Enter new name:', kid.name);
            const newAllowance = parseFloat(prompt('Enter new allowance:', kid.allowance));
            
            if (newName) kids[kidIndex].name = newName;
            if (!isNaN(newAllowance)) kids[kidIndex].allowance = newAllowance;
            
            saveKids(kids);
            updateKidProfiles();
        }
    }
    
    // Delete kid
    function deleteKid(kidId) {
        if (confirm('Are you sure you want to delete this kid profile?')) {
            kids = kids.filter(k => k.id !== parseInt(kidId));
            saveKids(kids);
            updateKidProfiles();
        }
    }
});
