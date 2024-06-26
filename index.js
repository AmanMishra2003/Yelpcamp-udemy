if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express = require('express');
const helmet = require('helmet')
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');


//validationschema
const {CampgroundSchema,ReviewSchema} = require('./schemas')


//util
const {catchAsync} = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

//models
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

//express 
const app = express()
const port = 3000;

//connection
//instead of .then and .catch i will use event emitter used with mongoose.connect
// const DBURL = process.env.DB_URL
const DBURL = process.env.DB_URL

mongoose.connect(DBURL).then(()=>{
    console.log("connection In!!")
}).catch((err)=>{
    console.error.bind(console, "connection error!")
})
// const db  = mongoose.connection;
// db.on('error',console.error.bind(console, "connection error!"))
// db.once('open',()=>{
//     console.log("connection In!!")
// })



const sessionConfig = {
    name:'session',
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:false,
    cookie :{
        httpOnly:true,
        expires: Date().now + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    },
    store: MongoStore.create({
        mongoUrl:DBURL,
        touchAfter: 24 * 3600 // don't want to resave all the session on database every single time that the user refreshes the page, you can lazy update the session, by limiting a period of time.
        // by doing this, setting touchAfter: 24 * 3600 you are saying to the session be updated only one time in a period of 24 hours, does not matter how many request's are made (with the exception of those that change something on the session data)
    })
}

//middleware
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session(sessionConfig))
app.use(flash())
app.use(mongoSanitize())//prevent SQL injection attack 
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdn.maptiler.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdn.maptiler.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dw3uvmlbu/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//passport
app.use(passport.initialize())
app.use(passport.session())
//check auth mention with database from with auth needs to be done
passport.use(new LocalStrategy(User.authenticate()))
// passport session function 
passport.serializeUser(User.serializeUser())//store user in the session
passport.deserializeUser(User.deserializeUser())//get user out of session

//routes
const userRoute = require('./routes/user')
const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/review')



app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.successReview = req.flash('successReview')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})

app.use('/',userRoute)
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)


app.get('/',(req,res)=>{
    res.render("home")
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err,req,res,next)=>{
    let {status=500} = err
    if(!err.message) err.message = 'Something Went Wrong!!'
    // console.log(err.name)
    // if(err.name = 'validationError'){
    //     status = 404,
    //     err.message = "Validation Error!"
    // }
    // res.status(status).send(message)
    res.status(status).render("error", {err})
})

app.listen(port, ()=>{
    
})