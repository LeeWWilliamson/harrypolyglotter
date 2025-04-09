const express = require('express');
const router = express.Router();

// Body parser middleware to parse POST request data
router.use(express.urlencoded({ extended: true }));

// Home route
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// About route
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Contact route (GET)
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us', confirmation: false });
});


// Contact route (POST)
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // You can process the form data here (e.g., save to database, send email, etc.)
  console.log('Form submitted:', { name, email, message });

  // Send a simple confirmation message
  res.render('contact', { title: 'Contact Us', confirmation: true });
});

module.exports = router;
