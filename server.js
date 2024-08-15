const express = require('express');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./routes/api');

const app = express();

// Apply security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API routes
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
