// Admin Dashboard JavaScript for Sana Barekzai's website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard loaded successfully.');
    
    // Load statistics
    loadStats();
    
    // Load messages
    loadMessages();
    
    // Load settings
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
});

// Load website statistics
function loadStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.stats) {
                const { totalPages, totalImages, totalVideos, totalMessages } = data.stats;
                
                document.getElementById('totalPages').textContent = totalPages;
                document.getElementById('totalImages').textContent = totalImages;
                document.getElementById('totalVideos').textContent = totalVideos;
                document.getElementById('contactMessages').textContent = totalMessages;
            }
        })
        .catch(error => {
            console.error('Error loading stats:', error);
        });
}

// Load contact messages
function loadMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.messages) {
                displayMessages(data.messages);
            } else {
                showNoMessages();
            }
        })
        .catch(error => {
            console.error('Error loading messages:', error);
            showNoMessages();
        });
}

// Display messages in the messages list
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    
    if (!messagesList) return;
    
    if (messages.length === 0) {
        showNoMessages();
        return;
    }
    
    // Clear existing messages
    messagesList.innerHTML = '';
    
    // Sort messages by timestamp (newest first)
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Create message items
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.dataset.id = message.id;
        
        const date = new Date(message.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageItem.innerHTML = `
            <div class="message-header">
                <strong>${message.name || 'Anonymous'}</strong> 
                <span class="message-time">${formattedDate}</span>
            </div>
            <div class="message-subject">${message.subject || 'No Subject'}</div>
            <div class="message-preview">${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</div>
            <button class="btn-delete" data-id="${message.id}">Delete</button>
        `;
        
        messagesList.appendChild(messageItem);
    });
    
    // Add delete button event listeners
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const messageId = this.dataset.id;
            deleteMessage(messageId);
        });
    });
}

// Show no messages message
function showNoMessages() {
    const messagesList = document.getElementById('messagesList');
    if (messagesList) {
        messagesList.innerHTML = '<p class="no-messages">No new messages. Contact form submissions will appear here.</p>';
    }
}

// Delete a message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    fetch('/api/messages/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: messageId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSettingsMessage('Message deleted successfully!', 'success');
            loadMessages();
            loadStats();
        } else {
            showSettingsMessage('Failed to delete message: ' + (data.error || 'Unknown error'), 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting message:', error);
        showSettingsMessage('Failed to delete message. Please try again.', 'error');
    });
}

// Load settings
function loadSettings() {
    fetch('/api/settings')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.settings) {
                const { siteName, primaryColor, secondaryColor } = data.settings;
                
                const siteNameInput = document.getElementById('siteName');
                const primaryColorInput = document.getElementById('primaryColor');
                const secondaryColorInput = document.getElementById('secondaryColor');
                
                if (siteNameInput) siteNameInput.value = siteName || 'Sana Barekzai';
                if (primaryColorInput) primaryColorInput.value = primaryColor || '#E8D8B3';
                if (secondaryColorInput) secondaryColorInput.value = secondaryColor || '#FCA590';
            }
        })
        .catch(error => {
            console.error('Error loading settings:', error);
        });
}

// Set up event listeners for admin buttons
function setupEventListeners() {
    // Manage Users button
    const manageUsersBtn = document.getElementById('manageUsers');
    if (manageUsersBtn) {
        manageUsersBtn.addEventListener('click', function() {
            alert('User management functionality will be implemented in future updates.');
        });
    }
    
    // Manage Content button
    const manageContentBtn = document.getElementById('manageContent');
    if (manageContentBtn) {
        manageContentBtn.addEventListener('click', function() {
            alert('Content management functionality will be implemented in future updates.');
        });
    }
    
    // Manage Settings button
    const manageSettingsBtn = document.getElementById('manageSettings');
    if (manageSettingsBtn) {
        manageSettingsBtn.addEventListener('click', function() {
            const settingsSection = document.querySelector('.card:last-child');
            if (settingsSection) {
                settingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Edit Home button
    const editHomeBtn = document.getElementById('editHome');
    if (editHomeBtn) {
        editHomeBtn.addEventListener('click', function() {
            alert('Edit Home Page functionality will be implemented in future updates.');
        });
    }
    
    // Edit About button
    const editAboutBtn = document.getElementById('editAbout');
    if (editAboutBtn) {
        editAboutBtn.addEventListener('click', function() {
            alert('Edit About Section functionality will be implemented in future updates.');
        });
    }
    
    // Edit Media button
    const editMediaBtn = document.getElementById('editMedia');
    if (editMediaBtn) {
        editMediaBtn.addEventListener('click', function() {
            alert('Manage Media functionality will be implemented in future updates.');
        });
    }
    
    // Edit Future button
    const editFutureBtn = document.getElementById('editFuture');
    if (editFutureBtn) {
        editFutureBtn.addEventListener('click', function() {
            alert('Edit Future Goals functionality will be implemented in future updates.');
        });
    }
    
    // Edit Choices button
    const editChoicesBtn = document.getElementById('editChoices');
    if (editChoicesBtn) {
        editChoicesBtn.addEventListener('click', function() {
            alert('Edit Choice Pages functionality will be implemented in future updates.');
        });
    }
    
    // Refresh Messages button
    const refreshMessagesBtn = document.getElementById('refreshMessages');
    if (refreshMessagesBtn) {
        refreshMessagesBtn.addEventListener('click', function() {
            loadMessages();
            showSettingsMessage('Messages refreshed!', 'success');
        });
    }
    
    // Settings form submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(settingsForm);
            const data = Object.fromEntries(formData);
            
            // Validate
            if (!data.siteName) {
                showSettingsMessage('Site name is required.', 'error');
                return;
            }
            
            // Update settings
            fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSettingsMessage('Settings saved successfully!', 'success');
                    
                    // Update the page title and header
                    document.title = data.settings.siteName + ' - Admin Dashboard';
                    const headerH1 = document.querySelector('header h1');
                    if (headerH1) {
                        headerH1.textContent = data.settings.siteName + ' - Admin Dashboard';
                    }
                } else {
                    showSettingsMessage('Failed to save settings: ' + (data.error || 'Unknown error'), 'error');
                }
            })
            .catch(error => {
                console.error('Error saving settings:', error);
                showSettingsMessage('Failed to save settings. Please try again.', 'error');
            });
        });
    }
}

// Show settings message
function showSettingsMessage(message, type) {
    const messageDiv = document.getElementById('settingsMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.className = '';
            messageDiv.textContent = '';
        }, 5000);
    }
}

// Console welcome message
console.log('%c🔒 Admin Dashboard - Sana Barekzai', 'font-size: 20px; color: #E8D8B3; font-weight: bold;');
console.log('%cManage your website content and settings', 'font-size: 14px; color: #FCA590;');
