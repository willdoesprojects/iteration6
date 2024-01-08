const express = require("express");
const router = express.Router();
const UserModel = require("../models/Users");


// const isAuthenticated = (req, res, next) => {
//     if (req.session.isAuth) {
//       next();
//     } else {
//       res.redirect("./signup");
//     }
//   }

router.get("/preferences", async (req, res) => {
    // const user = await UserModel.findById(req.session.userId);
    res.render('preferences', {username: "in progress hehe"});
})

module.exports = router;