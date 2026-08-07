const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
    secret: "secretString", 
    resave: false, 
    saveUninitialized: true
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/register", (req, res)=>{
    let {name= "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user is not resgistered");
    } else{
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res)=>{
    res.render("page.ejs", {name: req.session.name});
});

app.get("/reqcount", (req, res)=>{ 
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    res.send(`You sent the request ${req.session.count}`);
});

// app.get("/test", (req, res)=>{
//     res.send("test successful");
// });


// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res)=>{
//     res.cookie("made-in", "india", {signed: true});
//     res.send("sent signed cookie");
// });

// app.get("/verify", (req, res)=>{
//     res.send(req.signedCookies);
// });

// // sending cookies
// app.get("/getcookies", (req, res)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookies");
// }); 

// app.get("/greet", (req, res)=>{
//     let {name="Anonymous"} = req.cookies;
//     res.send(`hi ${name}`);
// });

// app.get("/", (req, res)=>{
//     console.log(req.cookies);
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);



app.listen(3000, ()=>{
    console.log("listening to port 3000");
});