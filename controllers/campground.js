const campGround = require('../models/campground');
const {cloudinary} = require('../cloudinary')


module.exports.index = async function (req,res) {

    const campgrounds  = await campGround.find({})
    res.render('campground/index',{campgrounds})
}

module.exports.renderNewForm = (req,res,next)=>{
    res.render('campground/new')
}

module.exports.createCampground =  async (req,res,next)=>{
    // if(!req.body.campground)throw new ExpressError("Invalid CampGround",400)
    const newCampground = new campGround(req.body.campground);
    newCampground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    newCampground.authur = req.user._id
    await newCampground.save();
    console.log(newCampground)
    req.flash('success','Successfully created')
    res.redirect(`/campground/${newCampground._id}`);
}

module.exports.showCampground= async(req,res)=>{
    const {id} = req.params
    const campground = await campGround.findById(id).populate({ path:'reviews',populate:{path:'authur'}}).populate('authur');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campground/show',{campground})
}

module.exports.renderEditForm = async(req,res)=>{
        const {id} = req.params
        const campground = await campGround.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campground');
        }
        res.render('campground/edit',{campground})
}

module.exports.editCampground = async (req,res)=>{
    const id = req.params.id
    console.log(req.body)
    const campground = await campGround.findByIdAndUpdate(id,req.body.campground);
    const img = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...img)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{ $in: req.body.deleteImages }}}})
    }
    req.flash('success','Successfully updated')
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteCampground = async (req,res,next)=>{
    const campground = await campGround.findByIdAndDelete(req.params.id,req.body.campground);
    res.redirect('/campground')
}

