const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const creditCardRoutes = require('./routes/creaditCards');
const session = require('express-session');
const passport = require('passport');

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// Passport Config
require('./passport-setup'); // Nạp cấu hình Passport


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public',express.static('public'));

// Session setup
app.use(session({
  secret: 'verysecret', // Chọn một chuỗi bí mật mạnh mẽ ở đây
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
const db = require('./config/db')
db.connect()


// Authentication Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login'); // Redirect nếu chưa đăng nhập
}


app.locals.formatCurrency = (amount) => {
  if (amount === undefined || amount === null) {
    return 'Không xác định'; // Hoặc bất kỳ giá trị mặc định nào khác
  }
  return amount.toLocaleString('vi-VN');
};


// Login and Logout Routes
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

app.get('/login', (req, res) => {
  res.render('login'); // Tạo một view login.ejs
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Use routes
app.use('/', ensureAuthenticated, creditCardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});