const fetch = require("node-fetch");
const userQueries = require("../db/queries.users.js");
const stripeApiKey = process.env.STRIPE_API_KEY;


module.exports = {
    success(req, res, next) {
        
        const session_id = req.param('session_id');
        const data = { headers: { 'Authorization': 'Bearer ' + stripeApiKey }}

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
                            req.flash("notice", "Updated account to premium");
                            res.redirect(`/`);
                        }
                    });   
                }
            }).catch(err => console.error(err));
        }
    },
    canceled(req, res, next) {
        res.render("signup");
    },
    // webhook(req, res, next) {
    //     const sig = req.headers['stripe-signature'];
    //     let event;

    //     const endpointSecret = 'whsec_atnNE4VWMJ2sdUQDibLZCFk02SyCmmFb';

    //     try {
    //         console.log("endpointSecret", endpointSecret)
    //         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    //     } catch (err) {
    //         return response.status(400).send(`Webhook Error: ${err.message}`);
    //     }

    //     // Handle the checkout.session.completed event
    //     if (event.type === 'checkout.session.completed') {
    //         const session = event.data.object;
    //     }

    //     // Return a response to acknowledge receipt of the event
    //     res.json({received: true});
        
    // },
    downgrade(req, res, next){


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
                    console.log("user.stripeId= ", user.stripeId)

                    if (json.deleted === true){
                        req.flash("notice", "Downgraded account to standard");
                        res.redirect(`/`);
                    }else{
                        req.flash("notice", res);
                        res.redirect(`/`);
                    }
                }).catch(err => console.error(err));
                
                
            }
        });  
        
    //     curl https://api.stripe.com/v1/customers \
    // -X DELETE \
    // -u sk_test_FWoxkWvzNiB747htG0V6Y7yC00GjN5mlwN:

    }
}





// res.send("hello");
// res.render("signup", {title: "Blocipedia"});


