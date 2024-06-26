const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports = {
    addReview : async(req,res,next)=>{
        const {id} = req.params
        const camp = await Campground.findById(id)
        const review  = new Review(req.body.review)
        review.author = req.user._id
        await review.save()
        camp.reviews.push(review);
        await camp.save()
        req.flash('successReview', ' Review Added...')
        res.redirect(`/campgrounds/${id}`)
    },
    deleteReview : async(req,res,next)=>{
        await Campground.findByIdAndUpdate(req.params.id, {$pull :{reviews:req.params.reviewid}})
        await Review.findByIdAndDelete(req.params.reviewid);
        req.flash('successReview', ' Review Deleted...')
        res.redirect(`/campgrounds/${req.params.id}`)
    }
}