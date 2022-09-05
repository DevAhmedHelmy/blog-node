const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const user = require("../models/user");

router.post(
  "/register",
  [
    body("name").isLength(3),
    body("email")
      .isEmail()
      .custom((value, { req }) => {
        return user.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists");
          }
        });
      }),
  ],
  authController.register
);
router.post("/login", [body("email").isEmail()], authController.login);
module.exports = router;
