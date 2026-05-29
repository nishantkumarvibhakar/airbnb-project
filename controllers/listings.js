const Listing=require("../models/listing");
module.exports.index=async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    };
    module.exports.renderNew= (req, res) => {
    
  res.render("listings/new.ejs");
};
module.exports.showListing=async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate({
        path:"reviews",
    populate:{
        path:"author",
    },
}).populate("owner");

    if (!listing) {
       req.flash("error"," Listing does not exits !");
       res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  };
module.exports.createListing=async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename; 
  
  const newListing = new Listing(req.body.listing);
newListing.owner=req.user._id;
newListing.image={url , filename};
    //if (req.body.listing.image) {
      //newListing.image = {
        //filename: "listingimage",
        //url: req.body.listing.image,
     // };
    //}
   
    await newListing.save();
    req.flash("success","New Listing created !");
    res.redirect("/listings");
  };
  module.exports.editListing=async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

     if (!listing) {
       req.flash("error"," Listing does not exits !");
       res.redirect("/listings");
    }
    let originalImgUrl=listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing ,originalImgUrl});
  };
  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
let listing= await Listing.findByIdAndUpdate(
  id,
  {
    ...req.body.listing,
  },
  {
    returnDocument: "after",
    runValidators: true,
  }
);


   // if (req.body.listing.image) {
     // listing.image = {
       // filename: "listingimage",
        //url: req.body.listing.image,
     // };
    //}
    if(typeof req.file !=="undefined"){
      let url = req.file.path;
  let filename = req.file.filename;
   listing.image={url,filename};
    await listing.save();
    }
     req.flash("success","Listing udated !");
    res.redirect(`/listings/${id}`);
  };
  module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
    res.redirect("/listings");
  };