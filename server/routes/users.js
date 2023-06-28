var express = require('express');
const { User } = require('../database/mongo_connection');
var app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { verifyToken } = require('../global_functions/auth');
const sendEmail = require('../global_functions/sendEmail');


// User specific
app.get('/', (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching users' });
    });
});



app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching the user' });
    });
});



// Signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user with the same email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Generate a unique token for the user
      const token = crypto.randomBytes(20).toString('hex');

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred while hashing the password' });
        }

        // Create a new user with the hashed password and token
        const newUser = new User({
          token: token,
          name,
          email,
          password: hashedPassword,
          preferredVideoQuality: '',
          subscription: false,
          recentlyWatched: [],
          wishlist: [],
          resetToken: "",
          resetTokenExpiration: ""
        });

        // Save the user to the database
        newUser.save()
          .then(() => {
            res.status(201).json({ user: 'User created successfully' });
          })
          .catch((error) => {
            res.status(500).json({ error: 'A DB error occurred while creating the user' });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while creating the user' });
    });
});



// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the entered password is correct
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred while comparing passwords' });
        }

        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, 'A!B@C#D$E%', { expiresIn: '5d' });
        user.token = token
        // Save the user to the database
        user.save()
          .then(() => {
            // Return user details and token
            res.json({ user });
          })
          .catch((error) => {
            res.status(500).json({ error: 'A DB error occurred while creating the token' });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while logging in' });
    });
});




// Reset Password
app.get('/reset-password', verifyToken, (req, res) => {
  const userId = req.userId;

  // Generate a password reset token and expiration date
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

  // Find the user by ID and update the reset token and expiration
  User.findByIdAndUpdate(userId, { resetToken, resetTokenExpiration }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Send the password reset email with the token
      // Replace the placeholders with your email logic
      const resetUrl = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;
      const emailBody = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`;
      // Your email-sending logic here (e.g., using Nodemailer or a similar library)
      sendEmail(user.email, 'Password Reset Request', emailBody);

      res.json({ message: 'Password reset email sent successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while resetting the password' });
    });
});


// Reset Password
app.post('/reset-password', (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Find the user by the reset token and check if it's valid
  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'An error occurred while hashing the new password' });
        }

        sendEmail(user.email, 'Password Reset Successful', "Your Password has been updated");

        // Update the user's password with the new hashed password
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        user.save();

        res.json({ message: 'Password reset successful' });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while resetting the password' });
    });
});


// Update Subscription
app.put('/users/:userId/subscription', (req, res) => {
  const { userId } = req.params;
  const { subscription } = req.body;

  // Find the user by ID and update the subscription status
  User.findByIdAndUpdate(userId, { subscription }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while updating the subscription' });
    });
});


app.get('/profile', verifyToken, (req, res) => {
  const userId = req.userId;
  console.log(userId)
  // Find the user by ID
  User.findById(userId)
    .then((user) => {
      console.log(user, " Logged in")
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching the user profile' });
    });
});


app.put('/profile/preferences', verifyToken, (req, res) => {
  const userId = req.userId;
  const { preferredVideoQuality } = req.body;

  // Find the user by ID and update their preferences
  User.findByIdAndUpdate(userId, { preferredVideoQuality }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User preferences updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while updating user preferences' });
    });
});


app.post('/recently-watched', verifyToken, (req, res) => {
  const userId = req.userId;
  const { contentId } = req.body;

  // Find the user by ID and add the content to recently watched
  User.findByIdAndUpdate(userId, { $push: { recentlyWatched: contentId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Content added to recently watched' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while adding content to recently watched' });
    });
});



module.exports = app;
