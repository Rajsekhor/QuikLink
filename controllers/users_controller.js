const User = require('../models/user');

module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (error, user) {
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user
      });
    });
  };
  
  module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
      User.findByIdAndUpdate(req.params.id,req.body,function(error,user){
        return res.redirect("back");
      })
    }else{
      return res.status(401).send("Unauthorized");
    }
  }

//render the Sign Up
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    res.render('user_sign_up', {
        title: "QuikLink | Sign Up"
    });
};

//render the Sign In
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    res.render('user_sign_in', {
        title: "QuikLink | Sign In",
    });
};

//get the sign up data
module.exports.create = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) { console.log('error in finding user'); return; }
        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) { console.log('error in finding user ' ,err); return; }

                res.redirect('/users/sign-in');
            });
        }
        else {
            res.redirect('back');
        }
    });
};

//sign in and create session for user
module.exports.createSession = (req, res) => {
    req.flash('success','Logged in Successfully');
    res.redirect('/');
};

module.exports.destroySession = function (req, res) {
    // logout has been upgraded as an asynchronous function so it requires a callback function to handle error now
    req.logout(function (error) {
      if (error) {
        return next(error);
      }
      req.flash('success','You have logged out!');
      return res.redirect("/");
    });
  };