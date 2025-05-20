const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Person = require("../models/person.models");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // console.log("Received credentials:", username, password);
      const user = await Person.findOne({ email });
      if (!user) return done(null, false, { message: "Incorrect email" });

      const isPasswordMatch = await user.comparePassword(password); // ? true : false;
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
