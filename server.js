// Server-side JavaScript for Sana Barekzai's website
// This file sets up a Node.js server with Express

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
const contactsFile = path.join(dataDir, 'contacts.json');
const settingsFile = path.join(dataDir, 'settings.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize contacts JSON file if it doesn't exist
if (!fs.existsSync(contactsFile)) {
    fs.writeFileSync(contactsFile, JSON.stringify({ messages: [] }, null, 2));
}

// Initialize settings JSON file if it doesn't exist
if (!fs.existsSync(settingsFile)) {
    const defaultSettings = {
        siteName: 'Sana Barekzai',
        primaryColor: '#E8D8B3',
        secondaryColor: '#FCA590',
        studentName: 'Sana Barekzai'
    };
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
}

// Helper function to read JSON file
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading JSON file:', err);
        return null;
    }
}

// Helper function to write JSON file
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing JSON file:', err);
        return false;
    }
}

// Define routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/media', function(req, res) {
    res.sendFile(path.join(__dirname, 'media.html'));
});

app.get('/media.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'media.html'));
});

app.get('/future', function(req, res) {
    res.sendFile(path.join(__dirname, 'future.html'));
});

app.get('/future.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'future.html'));
});

app.get('/choice1', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice1.html'));
});

app.get('/choice1.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice1.html'));
});

app.get('/choice2', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice2.html'));
});

app.get('/choice2.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice2.html'));
});

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API endpoint to get contact messages (for admin dashboard)
app.get('/api/messages', function(req, res) {
    const data = readJsonFile(contactsFile);
    if (data && data.messages) {
        res.json({ success: true, messages: data.messages });
    } else {
        res.json({ success: false, error: 'No messages found' });
    }
});

// API endpoint to get settings
app.get('/api/settings', function(req, res) {
    const settings = readJsonFile(settingsFile);
    if (settings) {
        res.json({ success: true, settings: settings });
    } else {
        res.json({ success: false, error: 'Settings not found' });
    }
});

// API endpoint to update settings
app.post('/api/settings', function(req, res) {
    const newSettings = req.body;
    const currentSettings = readJsonFile(settingsFile);
    
    if (currentSettings) {
        const updatedSettings = { ...currentSettings, ...newSettings };
        if (writeJsonFile(settingsFile, updatedSettings)) {
            res.json({ success: true, message: 'Settings updated successfully', settings: updatedSettings });
        } else {
            res.json({ success: false, error: 'Failed to update settings' });
        }
    } else {
        if (writeJsonFile(settingsFile, newSettings)) {
            res.json({ success: true, message: 'Settings created successfully', settings: newSettings });
        } else {
            res.json({ success: false, error: 'Failed to create settings' });
        }
    }
});

// Handle contact form submission
app.post('/submit-contact', function(req, res) {
    const formData = req.body;
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        return res.json({ success: false, error: 'All fields are required' });
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return res.json({ success: false, error: 'Please enter a valid email address' });
    }
    
    // Add timestamp to the message
    const messageWithTimestamp = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
    };
    
    // Read existing messages
    const data = readJsonFile(contactsFile);
    
    if (data && data.messages) {
        data.messages.push(messageWithTimestamp);
        if (writeJsonFile(contactsFile, data)) {
            console.log('New contact message received:', formData.name);
            res.json({ success: true, message: 'Message received successfully' });
        } else {
            res.json({ success: false, error: 'Failed to save message' });
        }
    } else {
        const newData = { messages: [messageWithTimestamp] };
        if (writeJsonFile(contactsFile, newData)) {
            console.log('New contact message received:', formData.name);
            res.json({ success: true, message: 'Message received successfully' });
        } else {
            res.json({ success: false, error: 'Failed to save message' });
        }
    }
});

// API endpoint to delete a message
app.post('/api/messages/delete', function(req, res) {
    const { messageId } = req.body;
    
    if (!messageId) {
        return res.json({ success: false, error: 'Message ID is required' });
    }
    
    const data = readJsonFile(contactsFile);
    
    if (data && data.messages) {
        const initialCount = data.messages.length;
        data.messages = data.messages.filter(msg => msg.id !== messageId);
        
        if (data.messages.length < initialCount) {
            if (writeJsonFile(contactsFile, data)) {
                res.json({ success: true, message: 'Message deleted successfully' });
            } else {
                res.json({ success: false, error: 'Failed to delete message' });
            }
        } else {
            res.json({ success: false, error: 'Message not found' });
        }
    } else {
        res.json({ success: false, error: 'No messages found' });
    }
});

// API endpoint to get website statistics
app.get('/api/stats', function(req, res) {
    // Count pages
    const pages = ['index.html', 'media.html', 'future.html', 'choice1.html', 'choice2.html', 'admin.html'];
    const totalPages = pages.length;
    
    // Count images in assets/images directory
    let totalImages = 0;
    try {
        const imagesDir = path.join(__dirname, 'assets', 'images');
        if (fs.existsSync(imagesDir)) {
            totalImages = fs.readdirSync(imagesDir).length;
        }
    } catch (err) {
        console.error('Error counting images:', err);
    }
    
    // Count videos in assets/videos directory
    let totalVideos = 0;
    try {
        const videosDir = path.join(__dirname, 'assets', 'videos');
        if (fs.existsSync(videosDir)) {
            totalVideos = fs.readdirSync(videosDir).length;
        }
    } catch (err) {
        console.error('Error counting videos:', err);
    }
    
    // Count contact messages
    let totalMessages = 0;
    const data = readJsonFile(contactsFile);
    if (data && data.messages) {
        totalMessages = data.messages.length;
    }
    
    res.json({
        success: true,
        stats: {
            totalPages,
            totalImages,
            totalVideos,
            totalMessages
        }
    });
});

// Serve assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 404 handler
app.use(function(req, res) {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Website URL: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server.');
});

// Export app for testing
module.exports = app;
