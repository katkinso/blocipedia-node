module.exports = class ApplicationPolicy {

     constructor(user, record) {
       this.user = user;
       this.record = record;
     }

     _isOwner() {
       return this.record && (this.record.userId == this.user.id);
     }
   
     _isAdmin() {
       return this.user && this.user.role == "admin";
     }

     _isPremium() {
       console.log(this.user.role)
        return this.user && this.user.role == "premium";
     }

     _isStandard() {
      return this.user && this.user.role == "standard";
   }

     new() {
       return this.user != null;
     }

     create() {
       return this.new();
     }

     show() {
       return true;
     }

     edit() {
       return this.new();
     }

     update() {
       return this.edit();
     }

     destroy() {
       return this.update();
     }

     setPrivate() {
      return this._isPremium();
    }
   }