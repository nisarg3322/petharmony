if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const serverless = require("serverless-http");

// requiring models
const User = require("./models/user_model");

// Requiring routes
const postRoutes = require("./routes/posts_routes");
const userRoutes = require("./routes/user_routes");

// database mongoose connect code
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/petharmony";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo Connected!!!!");
  })
  .catch((err) => {
    console.log("On No error");
    console.log(err);
  });

// Ejs engine load
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware to run every req object
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET || "thisshouldbeabettersecret!";
//Mongo store config
const store = mongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
});

const sessionConfig = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals middleware for every req object
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routers
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/posts", postRoutes);
app.use("/", userRoutes);

// universal error for not visiting wrong URL
app.all("*", (req, res, next) => {
  // res.send('opps something went wrong')

  next(new ExpressError("Page Not Found", 404));
});

//universal error for general error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("./error", { err });
});

const port = process.env.PORT || 3000;
// server listening code
module.exports = app;
module.exports.handler = serverless(app);
