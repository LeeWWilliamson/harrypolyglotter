const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// About route
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Contact route
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

module.exports = router;
