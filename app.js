if(process.env.NODE_ENV !== "production")
{
    const dotenv = require('dotenv');
    dotenv.config({path: './config.env' });
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsmate = require('ejs-mate');
const User = require('./models/users');
const Transfer = require('./models/transfers');
const session = require('express-session');
const flash = require('connect-flash');
//const mongodbstore = require('connect-mongodb-session') (session);
const port = process.env.PORT || 3000;

const DB= process.env.DATABASE || 'mongodb://localhost:27017/banking_system';
console.log(DB);
mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=> {
    console.log(`Connection Successful`);
}).catch((e)=>{
    console.log(`No connection`);
})
// mongoose.connect('mongodb://localhost:27017/banking_system', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, "connection error"));
// db.once("open", ()=>{
//     console.log("Database connected");
// });

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

const secret = process.env.SECRET || 'thisismysecret';
// const store = new mongodbstore({
//     url: DB,
//     secret,
//     touchAfter: 24 * 60 * 60
// });
// store.on('error', function (e){
//     console.log('SESSION STORE ERROR', e);
// })

const sessionsonfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionsonfig));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', async(req, res) =>{
    res.render('home');
});
app.get('/viewall', async(req, res) =>{
    try{
    const allusers = await User.find({});
   //res.send(allusers);
    res.render('viewall', {allusers});
    }
    catch(e){
        console.log('Catch an error: ', e);
    }
});
app.get('/:userid/info', async(req, res) =>{
    try{
    const user= await User.findById(req.params.userid);
    const allusers = await User.find( { "_id": { $ne: req.params.userid } } );
    res.render('info', {user, allusers});
    }
    catch(e){
        console.log('Catch an error: ', e);
    }
});
app.get('/transfer/:from', async(req, res) =>{
    try{
    const allusers = await User.find( { "_id": { $ne: req.params.from } } );
    const oneuser = await User.findById(req.params.from);
    res.render('transfer', {allusers, oneuser});
    }
    catch(e){
        console.log('Catch an error: ', e);
    }
});
app.get('/transfer/:from/:to', async(req, res) =>{
    try{
    const from = await User.findById(req.params.from);
    const to = await User.findById(req.params.to);
    res.render('fromto', {from, to});
    }
    catch(e){
        console.log('Catch an error: ', e);
    }
});
app.post('/transfer/:from/:to', async(req, res) =>{
    try{
    const from = await User.findById(req.params.from);
    const to = await User.findById(req.params.to);
    const amount= req.body.amount;
    if(amount<=from.currBal)
    {
        console.log(parseInt(amount) + parseInt(to.currBal))
        const fromupdate= await User.findByIdAndUpdate({'_id': req.params.from}, {$set: {'currBal': from.currBal-amount}});
        const toupdate= await User.findByIdAndUpdate({'_id': req.params.to}, {$set: {'currBal': parseInt(amount) + parseInt(to.currBal)}});
        const transfer  = new Transfer({'sender': from._id, 'receiver': to._id, 'amount': amount, 'date': new Date()});
        await transfer.save();
        req.flash('success', 'amount transferred successfully');
        res.redirect('/');
    }
    else{
        req.flash('error', 'Amount is more than the current balance');
        res.redirect(`/transfer/${from._id}/${to._id}`);
    }
}
catch(e){
    console.log('Catch an error: ', e);
}
});
app.listen(port, () =>{
    console.log(`Listening to port ${port}`)
});
