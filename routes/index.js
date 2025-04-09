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
  res.render('contact', {
    title: 'Contact Us',
    confirmation: false,
    errors: [], // Pass empty array for errors on initial load
    name: '',
    email: '',
    message: ''
  });
});


// Contact route (POST)
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation
  let errors = [];

  // Check if all fields are filled out
  if (!name || !email || !message) {
    errors.push('All fields are required.');
  }

  // Check if email is valid
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  // If there are errors, render the form again with error messages
  if (errors.length > 0) {
    return res.render('contact', {
      title: 'Contact Us',
      errors: errors, // Pass errors to the template
      name: name,
      email: email,
      message: message
    });
  }

  // If validation passes, you can process the data here (e.g., save to a database, send email)
  console.log('Form submitted:', { name, email, message });

  // Send a simple confirmation message
  res.render('contact', {
    title: 'Contact Us',
    confirmation: true,
    errors: [], // Clear errors after successful submission
    name: '',
    email: '',
    message: ''
  });
});

module.exports = router;
