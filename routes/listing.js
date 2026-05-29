const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")
const{isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer = require('multer');
const {storage}=require("../cloudfig.js");
const upload = multer({storage});
//Index Route
router.get(
    "/",
    wrapAsync(listingController.index)
);
// NEW Route
router.get("/new",isLoggedIn,listingController.renderNew);
// CREATE Route
router.post(
  "/",isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);


// SHOW Route
router.get(
  "/:id", 
  wrapAsync(listingController.showListing)
);

// EDIT Route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(listingController.editListing)
);

// UPDATE Route
router.put(
  "/:id", isLoggedIn,
  isOwner,
   upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE Route
router.delete(
  "/:id",isLoggedIn,isOwner,
  wrapAsync(listingController.deleteListing)
);
module.exports=router;