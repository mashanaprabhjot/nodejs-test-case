'use strict';

var Transactions = require('../models/transactions.model.js');
var User = require('../models/user.model.js');
var config = require( '../config' );
var Stripe = require('stripe')(config.stripeApiKey);
//var stripe_Customer = require('./public/javascripts/lib/stripe-customer');




exports.index = function (req, res, next) {
   
    if ( req.body ) {
        var transaction = new Transactions( {
            name: req.body.name
        });
        transaction.save( function( err, trans ) {
            if ( err ) {
                return console.log( err );
            }
            res.status( 200 ).end();
        });
    }
};

exports.createTransaction = function (req, res, next) {
    var user;

   

    

    User.findOne({
        name: req.body.username
    }, function (err, user) {
        if (err) {
            throw err;
        }
        
        if (user != null && (user.stripe_cust_id == null || user.stripe_cust_id == undefined || user.stripe_cust_id == ""))
        {
            Stripe.customers.create({
                source: req.body.token,
                description: user.name
            }).then(function (customer) {
                user.stripe_cust_id = customer.id;
                return Stripe.charges.create({
                    amount: req.body.amount,
                    currency: req.body.currency,
                    customer: customer.id
                });
            }).then(function (charge) {
                user.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Stripe customerId update failed.'
                        });
                    }
                });
            });
        }
        else {
            
            Stripe.charges.create({
                amount: req.body.amount,
                currency: req.body.currency,
                customer: user.stripe_cust_id
            }, function (err, charge) {
                if (err) {
                    res.status(200).json({
                        message: 'Stripe charge failed.'
                    });
                    return;
                }

                var transaction = new Transactions({
                    transactionId: charge.id,
                    amount: charge.amount * 100,
                    created: charge.created,
                    currency: charge.currency,
                    description: charge.description,
                    paid: charge.paid,
                    sourceId: charge.source.id
                });

                transaction.save(function (err) {
                    if (err) {
                        return res.status(500);
                    }
                    else {
                        res.status(200).json({
                            message: 'Payment is created.'
                        });
                    }
                });
                // asynchronously called
            });
        }
    });
};
