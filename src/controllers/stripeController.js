const fetch = require("node-fetch");
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

const stripeApiKey = process.env.STRIPE_API_KEY;


module.exports = {
    success(req, res, next) {
        
        const session_id = req.param('session_id');
        const data = { headers: { 'Authorization': 'Bearer ' + stripeApiKey }}
        const referer = req.header('Referer')

        if (req.user){
            fetch('https://api.stripe.com/v1/checkout/sessions/' + session_id, data)
            .then(res => res.json())
            .then(json => json.customer)
            .then(customer => (fetch('https://api.stripe.com/v1/customers/' + customer, data)))
            .then(res => res.json())
            .then(stripeCustomer => {

                //make sure the currently logged in user is the one upgrading the account
                if (req.user.email === stripeCustomer.email){

                    userQueries.updateUser(req.user.id, {role: 'premium', stripeId: stripeCustomer.id}, (err, user) => {
                        if(err || user == null){
                            res.redirect(404, `/`);
                        } else {
                            req.flash("notice", "Upgraded account to premium");
                            res.redirect(`/`);
                        }
                    });   
                }else{
                    res.redirect(`/`);
                }
            }).catch(err => console.error(err));
        }
    },
    canceled(req, res, next) {
        res.render("signup");
    },
    downgrade(req, res, next){

        console.log(req.user.id)

        userQueries.updateUser(req.user.id, {role: 'standard'}, (err, user) => {
            if(err || user == null){
                res.redirect(404, `/`);
            } else {

                const data = { 
                    headers: { 'Authorization': 'Bearer ' + stripeApiKey },
                    method: 'DELETE'
                 }
                
                fetch('https://api.stripe.com/v1/customers/' + user.stripeId, data)
                .then(res => res.json())
                .then(json => {

                    if (json.deleted === true){
                        
                        wikiQueries.updateUserWikisToPublic(req.user.id, (err, user) => {
                            req.flash("notice", "Downgraded account to standard");
                            res.redirect(req.header('Referer'));
                        })


                    }else{
                        req.flash("notice", res);
                        res.redirect(`/`);
                    }
                })
                
                .catch(err => console.error(err));
 
            }
        });  
        
    //     curl https://api.stripe.com/v1/customers \
    // -X DELETE \
    // -u sk_test_FWoxkWvzNiB747htG0V6Y7yC00GjN5mlwN:

    }
}





// res.send("hello");
// res.render("signup", {title: "Blocipedia"});


