// Server-side JavaScript for the website
// This file can be used to set up a Node.js server for your website

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Define routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/media', function(req, res) {
    res.sendFile(path.join(__dirname, 'media.html'));
});

app.get('/future', function(req, res) {
    res.sendFile(path.join(__dirname, 'future.html'));
});

app.get('/choice1', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice1.html'));
});

app.get('/choice2', function(req, res) {
    res.sendFile(path.join(__dirname, 'choice2.html'));
});

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});
