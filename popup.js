document.addEventListener('DOMContentLoaded', function() {
    // Load theme and power state preferences
    chrome.storage.local.get(['darkMode', 'extensionEnabled'], function(result) {
        if (result.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Set initial power state (default to enabled if not set)
        const isEnabled = result.extensionEnabled ?? true;
        updatePowerState(isEnabled);
    });

    // Theme toggle functionality
    document.getElementById('themeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        chrome.storage.local.set({
            darkMode: document.body.classList.contains('dark-mode')
        });
    });

    // Power toggle functionality
    document.getElementById('powerToggle').addEventListener('click', function() {
        const isCurrentlyEnabled = !document.body.classList.contains('disabled');
        updatePowerState(!isCurrentlyEnabled);
        
        // Save the state and send message to content script
        chrome.storage.local.set({
            extensionEnabled: !isCurrentlyEnabled
        }, function() {
            // Send message to all tabs to update their state
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateExtensionState',
                        enabled: !isCurrentlyEnabled
                    });
                });
            });
        });
    });

    // Your existing load and save functionality...
});

// Helper function to update power state
function updatePowerState(enabled) {
    const powerToggle = document.getElementById('powerToggle');
    if (enabled) {
        document.body.classList.remove('disabled');
        powerToggle.classList.remove('off');
    } else {
        document.body.classList.add('disabled');
        powerToggle.classList.add('off');
    }
}