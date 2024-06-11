const User=require("../models/user");

module.exports.signUpRoute=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signInRoute=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to TravelLust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("Welcome Back To TravelLust");
        res.redirect("/listings");
    }
}

module.exports.logUp=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To TravelLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Now LogedOut");
        res.redirect("/listings");
    })
}