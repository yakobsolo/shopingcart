const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const passport = require('passport');



const pages = require('./routes/pages');
const products = require('./routes/products.js');
const cart = require('./routes/cart.js');
const users = require('./routes/users.js');
const adminpages = require('./routes/adminpages')
const adminproducts = require('./routes/adminproducts');
const admincategorys = require('./routes/admincategorys');


const connectDb = require('./connect/db');

// INIT APP

const app = express();

//VIEW ENGINE SETUP

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// SET PUBLIC FOLDER  
app.use(express.static(path.join(__dirname, 'public')));  

// set global errors variable
app.locals.errors = null;


// Get Page Model
var Page = require('./models/page');

// Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

// Get Category Model
var Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});


// body parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

// express validator middelware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '{' + namespace.shift() + '}';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };

        },
        customValidators: {
            isImage: function (value, filename) {
                var extension = (path.extname(filename)).toLowerCase();
                switch (extension) {
                    case '.jpg':
                        return '.jpg';
                    case '.jpeg':
                        return '.jpeg';
                    case '.png':
                        return '.png';
                    case '':
                        return '.jpg';
                    default:
                        return false;
                }
            }
        }
}))



// express messages midddleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express file upload middleware
app.use(fileUpload());

//passport config
require('./connect/passport') (passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
 });
 
 

app.use('/admin/pages', adminpages);
app.use('/admin/categories', admincategorys);
app.use('/admin/products', adminproducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);

app.use('/', pages);


// start the server

const port = process.env.PORT || 8000;

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URL);
        app.listen(port, console.log(console.log(`server is listening on ${port}...`)));

    } catch(error) {
        console.log(error);

    } 
}

start();
