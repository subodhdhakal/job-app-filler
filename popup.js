document.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    chrome.storage.local.get('darkMode', function(result) {
        if (result.darkMode) {
            document.body.classList.add('dark-mode');
        }
    });

    // Theme toggle functionality
    document.getElementById('themeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        chrome.storage.local.set({
            darkMode: document.body.classList.contains('dark-mode')
        });
    });

    // Load saved data when popup opens
    chrome.storage.local.get([
        'firstName',
        'lastName',
        'email',
        'linkedin',
        'website',
        'address',
        'zipcode'
    ], function(result) {
        document.getElementById('firstName').value = result.firstName || '';
        document.getElementById('lastName').value = result.lastName || '';
        document.getElementById('email').value = result.email || '';
        document.getElementById('linkedin').value = result.linkedin || '';
        document.getElementById('website').value = result.website || '';
        document.getElementById('address').value = result.address || '';
        document.getElementById('zipcode').value = result.zipcode || '';
    });

    // Save data when button is clicked
    document.getElementById('saveButton').addEventListener('click', function() {
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            linkedin: document.getElementById('linkedin').value,
            website: document.getElementById('website').value,
            address: document.getElementById('address').value,
            zipcode: document.getElementById('zipcode').value
        };

        chrome.storage.local.set(data, function() {
            // Show a quick feedback message
            const button = document.getElementById('saveButton');
            button.textContent = 'Saved!';
            button.style.backgroundColor = '#45a049';
            
            // Close the popup after a brief delay
            setTimeout(() => {
                window.close();
            }, 750); // Closes after 0.75 seconds
        });
    });
});