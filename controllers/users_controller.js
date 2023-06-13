const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Friendship = require("../models/friendship");
const queue = require("../config/kue");
const forgotEmailWorker = require("../workers/forgot_pass_email_worker");

module.exports.profile_plain = function (req, res) {
  User.findById(req.params.id, function (error, user) {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.profile = async function (req, res) {
  try {
    let friendstatus = false;
    let currentId = req.params.id;
    let currentUser = req.params.user;

    let user = await User.findById(req.params.id).exec();
    if (!user) {
      console.log("User not found");
      return res.redirect("/");
    }

    if (user.friendships.length === 0) {
      return res.render("user_profile", {
        title: "User Profile",
        profile_user: user,
        friendstatus: friendstatus,
      });
    }

    for (let i = 0; i < user.friendships.length; i++) {
      let friendtemp = await Friendship.findById(user.friendships[i]).exec();

      if (
        friendtemp &&
        friendtemp.to_user == currentId &&
        friendtemp.from_user == currentUser
      ) {
        friendstatus = true;
        break;
      }
    }

    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
      friendstatus: friendstatus,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.redirect("/");
  }
};

// module.exports.update = function(req,res){
//   if(req.user.id == req.params.id){
//     User.findByIdAndUpdate(req.params.id,req.body,function(error,user){
//       return res.redirect("back");
//     })
//   }else{
//     return res.status(401).send("Unauthorized");
//   }
// }

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (error) {
        if (error) {
          console.log("**** Multer error :", error);
        } else {
          user.name = req.body.name;
          user.email = req.body.email;
        }
        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          // this is saving the path of an uploaded file into the avatar field of the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (error) {
      return res.redirect("back");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};

//render the Sign Up
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  res.render("user_sign_up", {
    title: "QuikLink | Sign Up",
  });
};

//render the Sign In
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  res.render("user_sign_in", {
    title: "QuikLink | Sign In",
  });
};

module.exports.forgot_nav = (req, res) => {
  return res.render("forgot_password", {
    title: "QuikLink | Forgot Password",
  });
};

module.exports.forgot = async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        console.log("error in finding user");
        return;
      }
      if (!user) {
        req.flash("error", "User does not exist");
        return res.redirect("back");
      } else {
        password = {
          email: user.email,
          content: user.password,
        };
        let job = queue
          .create("forget_password", password)
          .save(function (err) {
            if (err) {
              console.log("Error in sending to the queue", err);
              return;
            }
            console.log("Job enqueued", job.id);
          });
        console.log(user.password);
        req.flash("success", "Check your email for password");
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

//get the sign up data
module.exports.create = (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("error in finding user");
      return;
    }
    if (!user) {
      User.create(req.body, (err, user) => {
        if (err) {
          console.log("error in finding user ", err);
          return;
        }

        res.redirect("/users/sign-in");
      });
    } else {
      res.redirect("back");
    }
  });
};

//sign in and create session for user
module.exports.createSession = (req, res) => {
  req.flash("success", "Logged in Successfully");
  res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  // logout has been upgraded as an asynchronous function so it requires a callback function to handle error now
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/");
  });
};
