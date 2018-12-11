const express = require('express');
const keys = require('./config/keys');
const stripe  = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');

const app     = express();

// Handlebars Middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// SET The STATIC Folder
app.use(express.static(`${__dirname}/public`));

// Index / Home Page Route
app.get('/',(req, res)=>{
    res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
    });
});

// Success Route
app.get('/success',(req, res)=>{
    res.render('success');
});

// Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount: amount,
        description: 'Ebook practice by Suman kumar panda', 
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'));

});

const port    = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is Running on port ${port}`);
});