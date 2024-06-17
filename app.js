if(process.env.NODE_ENV != "production"){
    require('dotenv').config();    
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const User = require("./models/user");

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

const DBurl=process.env.ATLASDB_URL

const store=MongoStore.create({
    mongoUrl:DBurl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,   
})

store.on("error",()=>{
    console.log("error on store ", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 10 * 24 * 60 * 60 * 1000,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOption));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set local variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log("DB Connection Error:", err);
});

async function main(){
    mongoose.connect(DBurl)
}

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // console.log(err);
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
