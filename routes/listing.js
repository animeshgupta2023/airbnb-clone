const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js"); 
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>{el.message}).join(","); 
        throw new ExpressError(400, error);
    } else{
        next();
    }
}

// index route
router.get("/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
}));

router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
});

// create
router.post("/", 
    validateListing,
    wrapAsync(async (req, res)=>{
        const newListing = new Listing(req.body.listing); // here the req.body returns the object from new.ejs named listing
        await newListing.save();
        res.redirect("/listings");
    })
);

// show route
// read of crud operations
router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));


// edit route
router.get("/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing}); 
}));

// update route
router.put("/:id", validateListing,
        wrapAsync(async (req, res)=>{
        let {id} = req.params; 
        await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
        res.redirect(`/listings/${id}`); 
    }
)); 

// delete  a listing route
router.delete("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;