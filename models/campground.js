const Review = require('./review')
const mongoose  = require("mongoose");
const Schema  = mongoose.Schema; //just making reference to mongoose.Schema for ease
const opts = {toJSON :{virtuals:true}}

// https://res.cloudinary.com/dw3uvmlbu/image/upload/v1719134182/YelpCamp/wlzfbzzyqto2ekvzxioi.png

const imageSchema = Schema( {
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const CampgroundSchema = Schema({
    title : String,
    image: [imageSchema], 
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price : Number,
    description : String,
    location : String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<h6> <a href="/campgrounds/${this._id}" class='text-decoration-none text-dark'>${this.title}</a> </h6>`
});

CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)