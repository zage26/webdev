const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      messsage: `{VALUE} is not a valid email.`
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 5
  }
})

userSchema.pre("save", function(next) {
  const user = this;
  if(user.isModified("password")) {
    bcrypt.hash(user.password, 10)
      .then(hashedPassword => {
        user.password = hashedPassword;
        next();
      })
      .catch(e => {
        console.log(e);
        next();
      })
  }
})


const User = mongoose.model("User", userSchema);

module.exports = User;
