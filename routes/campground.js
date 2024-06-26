const express = require('express');
const {catchAsync} = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {CampgroundSchema} = require('../schemas')
const {storage} = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({storage})

const camgrounds = require('../controllers/campgrounds')

const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');

const router = express.Router()

router.route('/')
    .get(catchAsync(camgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(camgrounds.newCampground))//add in database
    // .post(,(req,res)=>{
    //     console.log(req.body, req.files)
    //     res.send('it worked!!')
    // })

//new campground form
router.get('/new',isLoggedIn, camgrounds.newCampgroundForm )

router.route('/:id')
    .get(catchAsync(camgrounds.showCampground))//show page
    .put(isLoggedIn,isAuthor,upload.fields([{name:'image'}]), validateCampground, catchAsync(camgrounds.editCampground))//add update in database
    .delete(isLoggedIn,isAuthor, catchAsync(camgrounds.deleteCampground))

//edit form
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(camgrounds.editCampgroundForm))

module.exports = router