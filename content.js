let activeMenu = null;

// Add custom styles to the page
const style = document.createElement('style');
style.textContent = `
    .auto-fill-menu {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        padding: 5px;
        z-index: 10000;
        min-width: 200px;
    }
    .auto-fill-item {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
    }
    .auto-fill-item:hover {
        background-color: #f0f0f0;
    }
    .auto-fill-label {
        font-weight: bold;
        color: #666;
        margin-right: 5px;
    }
`;
document.head.appendChild(style);

// Define form fields in the desired order with display names
const formFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'website', label: 'Website' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'zipcode', label: 'Zip Code' }
];

// Function to create and show menu
function showAutoFillMenu(input) {
    // Remove any existing menu
    if (activeMenu) {
        activeMenu.remove();
    }

    // Create new menu
    const menu = document.createElement('div');
    menu.className = 'auto-fill-menu';
    activeMenu = menu;

    // Position the menu below the input field
    const rect = input.getBoundingClientRect();
    menu.style.top = `${window.scrollY + rect.bottom + 5}px`;
    menu.style.left = `${window.scrollX + rect.left}px`;

    // Get saved data and create menu items in the defined order
    chrome.storage.local.get(formFields.map(field => field.key), function(data) {
        if (Object.keys(data).length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'auto-fill-item';
            emptyItem.textContent = 'No saved data. Click extension icon to add data.';
            menu.appendChild(emptyItem);
        } else {
            formFields.forEach(({ key, label }) => {
                const value = data[key];
                if (value) {
                    const item = document.createElement('div');
                    item.className = 'auto-fill-item';

                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'auto-fill-label';
                    labelSpan.textContent = `${label}:`;

                    const valueSpan = document.createElement('span');
                    valueSpan.textContent = value;

                    item.appendChild(labelSpan);
                    item.appendChild(valueSpan);

                    item.addEventListener('click', function() {
                        input.value = value;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        menu.remove();
                        activeMenu = null;
                    });

                    menu.appendChild(item);
                }
            });
        }
    });

    document.body.appendChild(menu);
}

// Show menu on double-click of input fields
document.addEventListener('dblclick', function(e) {
    const input = e.target;
    if (input.tagName === 'INPUT' && input.type !== 'submit' && input.type !== 'button') {
        e.preventDefault();
        showAutoFillMenu(input);
    }
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (activeMenu && !activeMenu.contains(e.target) && e.target.tagName !== 'INPUT') {
        activeMenu.remove();
        activeMenu = null;
    }
});

// Close menu when pressing Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeMenu) {
        activeMenu.remove();
        activeMenu = null;
    }
});
