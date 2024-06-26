const express = require('express');
const {catchAsync} = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const Review = require('../models/review');
const {isLoggedIn, validateReview , isReviewAuthor} = require('../middleware');

const router = express.Router({mergeParams:true})

const reviews = require('../controllers/reviews')


//review validations
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.addReview))

router.delete('/:reviewid',isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router