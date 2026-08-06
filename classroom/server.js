const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res)=>{
    res.cookie("made-in", "india", {signed: true});
    res.send("sent signed cookie");
});

app.get("/verify", (req, res)=>{
    res.send(req.signedCookies);
});

// sending cookies
app.get("/getcookies", (req, res)=>{
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("sent you some cookies");
}); 

app.get("/greet", (req, res)=>{
    let {name="Anonymous"} = req.cookies;
    res.send(`hi ${name}`);
});

app.get("/", (req, res)=>{
    console.log(req.cookies);
    res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("listening to port 3000");
});