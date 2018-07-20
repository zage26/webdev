//email: me@gmail.com
//password: 123abc --> don't want to be in plain text, want encryption
// like: 2384092fjsljdf0s8df0
//type of encryption called hashing --> can only encrypt it, can't decrypt it
//there are other ways where one can enrypt and decrypt

const bcrypt = require("bcryptjs");

const password = "abc";
console.log("Password:", password);

//# = rounds of salt
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//      // Store hash in your password DB.
//      console.log("Hashed password:", hash);
//   })
// })

// bcrypt.hash(password, 10,(err, hash) => {
//   console.log("Hashed password:", hash);
// })

//promise version
bcrypt.hash(password, 10)
  .then((hash) => {
    console.log("Hashed password:", hash);
  })
  .catch(e => {
    console.log(e);
  })

const hashedPassword = "$2a$10$p5CUkFunLnR/6jlJo/OyKuJZCL0aXSlm3rOu57yiCmNDo5qocevTa";

//comparing passwords
bcrypt.compare(password, hashedPassword, (err, res) => {
  //res === true
  console.log("Password is valid:", res);
});
