if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const User = require("../models/user");
const UserOTP = require("../models/userOTP");
const nodemailer = require("nodemailer");

// Password handler
const bcrypt = require("bcrypt");

// OTP SetUp
const transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

module.exports.sendOTPEmail = async (req, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: req.email,
      subject: "Verify Your Email",
      html: `<p>${otp}</p>`,
    };

    // hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTP = new UserOTP({
      userId: req._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
    });

    // save otp record
    await newOTP.save();
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred");
        console.log(error.message);
      }
      console.log("Message sent successfully!");
      console.log(nodemailer.getTestMessageUrl(info));
      // only needed when using pooled connections
      transporter.close();
    });
  } catch (error) {
    req.flash("error", "Something went wrong");
    res.redirect("/users/delete");
  }
};

module.exports.renderOTP = async (req, res) => {
  const userId = req.user._id;
  if (
    userId === undefined ||
    mongoose.Types.ObjectId.isValid(userId) === false
  ) {
    req.flash("error", "Something went wrong");
    res.redirect("/users/delete");
  } else {
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Something went wrong");
      res.redirect("/users/delete");
    } else {
      res.render("users/OTP", { user, title: "Enter OTP" });
    }
  }
};

// Verify otp email
module.exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.user._id;
    let { digit1, digit2, digit3, digit4 } = req.body;
    let otp = digit1.concat(digit2, digit3, digit4);
    // let userId = userID;
    if (!userId || !otp) {
      if (!otp) {
        req.flash("error", "OTP can't be empty");
        res.redirect("/users/verifyOTP");
      }
      if (!userId) {
        req.flash("error", "No User was found");
        res.redirect("/users/delete");
      }
    } else {
      // Yes, it's a valid ObjectId, proceed with `findById` call

      let UserOTPRecords = await UserOTP.find({ userId: userId });
      if (UserOTPRecords.length <= 0) {
        // no record found
        req.flash("error", "No OTP was given Please Try Again");
        res.redirect("/users/verifyOTP");
      } else {
        // user otp record exists
        const { expiresAt } = UserOTPRecords[0];
        const hashedOTP = UserOTPRecords[0].otp;
        if (expiresAt < Date.now()) {
          // user otp record has expired
          req.flash("error", "Code has expired.Please request again");
          res.redirect("/users/verifyOTP");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          console.log(validOTP);
          if (!validOTP) {
            // supplied otp is wrong
            req.flash("error", "Invalid code passed. Check your index");
            res.redirect("/users/verifyOTP");
          } else {
            // success
            await UserOTP.deleteMany({ userId });
            res.redirect("/users/deleteFinal");
          }
        }
      }
    }
  } catch (error) {
    // req.flash("error", "Something went wrong");
    req.flash("error", error.message);
    res.redirect("/users/delete");
  }
};
