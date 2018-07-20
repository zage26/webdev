const User = require("./app/userModel.js");
const mongoose = require("mongoose");
const nev = require("email-verification")(mongoose);

mongoose.connect('mongodb://localhost:27017/emailVerification')
  .then(() => {
    console.log("Successful connection.");
  })
  .catch(e => {
    console.log("Failed connection.");
  })
//
//   nev.configure({
//       verificationURL: 'https://paly.net/',
//       persistentUserModel: User,
//       tempUserCollection: 'emailVerification_tempusers',
//
//       transportOptions: {
//           service: 'Gmail',
//           auth: {
//               user: 'zagehub@gmail.com',
//               pass: 'z@geHub18'
//           }
//       },
//       verifyMailOptions: {
//           from: 'Do Not Reply <zagehub@gmail.com>',
//           subject: 'Please confirm account',
//           html: 'Click the following link to confirm your account:<p>${URL}</p>',
//           text: 'Please confirm your account by clicking the following link: ${URL}'
//       }
//   }, function(error, options){
//   });
//
//   nev.generateTempUserModel(User);
//
//   var TempUser = require('./app/tempUserModel');
//   nev.configure({
//       tempUserModel: TempUser
//   }, function(error, options){
//   });
//
//   // get the credentials from request parameters or something
// const email = "zagephillips@gmail.com";
// const password = "abc123";
//
// const newUser = User({
//     email: email,
//     password: password
// });
//
// nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
//     // some sort of error
//     if (err) {
//       console.log(e);
//     }
//         // handle error...
//
//     // user already exists in persistent collection...
//     if (existingPersistentUser) {
//       console.log("User already exists");
//     }
//         // handle user's existence... violently.
//
//     // a new user
//     if (newTempUser) {
//         const URL = newTempUser[nev.options.URLFieldName];
//         nev.sendVerificationEmail(email, URL, function(err, info) {
//             if (err) {
//               console.log("newTempUser error");
//             }
//                 // handle error...
//
//             // flash message of success
//         });
//
//     // user already exists in temporary collection...
//     } else {
//       console.log("FAILURE");
//         // flash message of failure...
//     }
// });
//
// // sync version of hashing function
// var myHasher = function(password, tempUserData, insertTempUser, callback) {
//   var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//   return insertTempUser(hash, tempUserData, callback);
// };
//
// var url = 'https://paly.net/';
// nev.confirmTempUser(url, function(err, user) {
//     if (err){
//       console.log(err);
//     }
//         // handle error...
//
//     // user was found!
//     if (user) {
//         // optional
//         nev.sendConfirmationEmail(user['email_field_name'], function(err, info) {
//             console.log("SUCCESS!");
//         });
//     }
//
//     // user's data probably expired...
//     else {
//       console.log("Data expired");
//     }
//         // redirect to sign-up
// });

// var email = '...';
// nev.resendVerificationEmail(email, function(err, userFound) {
//     if (err)
//         // handle error...
//
//     if (userFound)
//         // email has been sent
//     else
//         // flash message of failure...
// });
