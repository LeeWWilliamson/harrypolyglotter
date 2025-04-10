require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const axios = require('axios');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');

// Route to render the homepage
router.get('/', async (req, res) => {
  try {
    const selectedLang = req.query.lang; // e.g., 'es', 'fr', etc.

    // Fetch English characters
    const enResponse = await axios.get('https://potterapi-fedeperin.vercel.app/en/characters');
    const enCharacters = enResponse.data;

    let translatedCharacters = [];

    if (selectedLang) {
      const langResponse = await axios.get(`https://potterapi-fedeperin.vercel.app/${selectedLang}/characters`);
      const langCharacters = langResponse.data;

      // Merge characters by their index
      translatedCharacters = enCharacters.map((char) => {
        const translatedChar = langCharacters.find((c) => c.index === char.index);
        return {
          ...char,
          translatedFullName: translatedChar?.fullName || '',
          translatedHouse: translatedChar?.hogwartsHouse || ''
        };
      });
    }

    res.render('index', {
      title: 'Harry Polyglotter',
      characters: selectedLang ? translatedCharacters : enCharacters,
      selectedLang
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Something went wrong.');
  }
});

// Setup the email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Access the EMAIL_USER environment variable
    pass: process.env.EMAIL_PASS   // Access the EMAIL_PASS environment variable
  }
});

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

  // If validation passes, send the email using Nodemailer
  const mailOptions = {
    from: email,  // Sender's email address (user's email)
    to: 'leewwilliamson@gmail.com',  // Replace with your email address
    subject: 'New Contact Form Submission',
    text: `You have a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.render('contact', {
        title: 'Contact Us',
        confirmation: false,
        errors: ['Failed to send email. Please try again later.'],
        name: name,
        email: email,
        message: message
      });
    } else {
      console.log('Email sent: ' + info.response);
      res.render('contact', {
        title: 'Contact Us',
        confirmation: true,
        errors: [], // Clear errors after successful submission
        name: '',
        email: '',
        message: ''
      });
    }
  });
});

module.exports = router;
