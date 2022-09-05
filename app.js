const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require('./routes/auth')
const MONGODB_URI =
  "mongodb+srv://helmy:jXef9jwRbG66GQ9Y@cluster0.ogtsr.mongodb.net/blog";

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
}); 
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images/", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  next();
});
app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});
mongoose
  .connect(`${MONGODB_URI}?retryWrites=true&w=majority`)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
