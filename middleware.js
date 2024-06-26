const ExpressError = require('./utils/ExpressError')
const {CampgroundSchema,ReviewSchema} = require('./schemas')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error',' You need to be Logged In')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    // const result = CampgroundSchema.validate(req.body)
    const { error } = CampgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campgrounds = await Campground.findById(id)
    if(!campgrounds && !campgrounds.author.equals(req.user._id)){
        req.flash('error','You do not have persmission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewid} = req.params;
    const review = await Review.findById(reviewid)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have persmission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()

}

module.exports.validateReview= (req,res,next)=>{ 
    // const result = CampgroundSchema.validate(req.body)
    const {error} = ReviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

// module.exports.doesExist=(req,res,next)=>{
//     const campground = do
// }