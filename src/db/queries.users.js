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
        let messages = [];
        err.errors.map(m => {
            messages.push({'msg':m.message, 'param': m.path});
        })
      callback(messages);
    })
  }

}