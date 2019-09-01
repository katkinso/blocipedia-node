const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
        // console.log("XXXX= ", err.errors[0].message);

        let errorMessages = [];
        err.errors.map(m => {
            errorMessages.push(m.message);
        })
        
        errorMessages.push("another error");
        console.log("XXXX2= ", errorMessages);

      callback(errorMessages);
    })
  }

}