module.exports = {
    index(req, res, next){
    //   res.send("hello");
        res.render("static/index", {title: "From Static Controller"});
    }
  }