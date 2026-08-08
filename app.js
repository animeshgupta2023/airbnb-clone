const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");    
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "secretString", 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.get("/", (req, res)=>{
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash()); // flash comes before the routes

app.use(passport.initialize()); // this is a middleware that initializes the passport for the each request.
app.use(passport.session()); // because of this in a single session a we can identify the user
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in local Strategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld"); 
//     res.send(registeredUser);
// });

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



// here the we write the regex code for the routes which are not defined
app.all(/.*/ , (req, res, next)=>{
    next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next)=>{
    let {status=500, message="something went wrong"} = err;
    res.status(status).render("Error.ejs", {message});
    //res.status(status).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080.");
});