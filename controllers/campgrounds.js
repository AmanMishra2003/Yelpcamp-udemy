const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports = {
        index : async (req, res, next) => {
                    const campgrounds = await Campground.find({})
                    res.render('campgrounds/index', { campgrounds })
                },
        newCampgroundForm : (req, res) => {
                    res.render('campgrounds/new')
                },
        showCampground : async (req, res,next) => {
                    const { id } = req.params;
                    const campgrounds = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
                    if(!campgrounds){
                        req.flash("error","Campground Doesn't Exist")
                        return res.redirect('/campgrounds')
                    }
                    res.render('campgrounds/show', { campgrounds })
                },
        newCampground : async (req, res, next) => {
                    const geodata = await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1})
                    const camp = new Campground(req.body.campground);
                    camp.geometry = geodata.features[0].geometry;
                    camp.image = req.files.map(el => ({url: el.path , filename: el.filename }))
                    camp.author = req.user._id
                    await camp.save()
                    console.log(camp)
                    req.flash('success', ' Campground Added...')
                    res.redirect(`/campgrounds/${camp.id}`)
                },
        editCampgroundForm : async (req,res,next) => {
                    const { id } = req.params;
                    const campgrounds = await Campground.findById(id)
                    if(!campgrounds){
                        req.flash("error","Campground Doesn't Exist")
                        return res.redirect('/camgrounds')
                    }
                    res.render('campgrounds/edit', { campgrounds })
                },
        editCampground : async (req, res, next) => {
            // console.log(req.files)
                    const { id } = req.params;
                    const geodata = await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1})
                    
                    const campgrounds = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new:true})
                    campgrounds.geometry = geodata.features[0].geometry;
                    if(req.files.image){
                        const imgs = req.files.image.map(el => ({url: el.path , filename: el.filename }))
                        campgrounds.image.push(...imgs)
                    }
                    console.log(req.body.deleteImages)
                    if(req.body.deleteImages){
                        req.body.deleteImages.forEach(async(ele)=>{
                            await cloudinary.uploader.destroy(ele)
                        })
                        await campgrounds.updateOne({$pull : {image : {filename : {$in : req.body.deleteImages}}}})
                    }
                    await campgrounds.save()
                    req.flash('success', ' Campground Updated...')
                    res.redirect(`/campgrounds/${campgrounds.id}`)
                },
        deleteCampground : async (req, res, next) => {
                    const { id } = req.params;
                    await Campground.findByIdAndDelete(id)
                    req.flash('success', ' Campground Deleted...')
                    res.redirect(`/campgrounds`)
                }

}