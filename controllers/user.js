const User = require('../models/user');

module.exports = {
    registerForm : (req,res)=>{
        res.render('auth/register')
    },
    register : async(req,res)=>{
        try{    
            const {username, email, password} = req.body
            const user = new User({username, email})
            const result = await User.register(user, password)
            req.login(result, (err)=>{
                if(err) return next(err)
                // req.flash('success', 'Welcome to YelpCamp')
                res.redirect('/')
            })//establish a login session
            
        }catch(err){
            req.flash('error', err.message)
            res.redirect('/register')
        }    
    },
    loginForm : (req,res)=>{
        res.render('auth/login')
    },
    login : (req,res)=>{
        req.flash('success','Logged in!!')
        const redirectUrl = res.locals.returnTo || '/campgrounds'
        res.redirect(redirectUrl)
     },
    logout : (req,res)=>{
        req.logout((err)=>{
            if(err){
                return next(err)
            }
            req.flash('success','Logged Out!')
            res.redirect('/campgrounds')
        })
       
    }
}