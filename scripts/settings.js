document.addEventListener('DOMContentLoaded', () => {
    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('settings')) || {
        shareData: false,
        notifications: true,
        passwordProtection: false,
        biometricAuth: false
    };

    // Initialize checkboxes
    document.getElementById('share-data').checked = settings.shareData;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('password-protection').checked = settings.passwordProtection;
    document.getElementById('biometric-auth').checked = settings.biometricAuth;

    // Save settings when changed
    function saveSettings() {
        settings.shareData = document.getElementById('share-data').checked;
        settings.notifications = document.getElementById('notifications').checked;
        settings.passwordProtection = document.getElementById('password-protection').checked;
        settings.biometricAuth = document.getElementById('biometric-auth').checked;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // Add event listeners to checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', saveSettings);
    });

    // Clear data button
    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            // Reload page to reflect changes
            location.reload();
        }
    });
});
