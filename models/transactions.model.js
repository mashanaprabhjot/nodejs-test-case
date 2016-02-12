'use strict';

//var mongoose = require( 'mongoose' );
//var config = require( '../config' );

var mongoose = require('mongoose');
var bcrypt = require('../public/javascripts/lib/bcrypt/bCrypt.js');
var config = require('../config');
var apiError = require('../api/api-error');

var transactionsSchema = mongoose.Schema( {
    transactionId: String,
    amount: Number,
    created: Number,
    currency: String,
    description: String,
    paid: Boolean,
    sourceId: String
} );

var Transactions = mongoose.model( 'Transactions', transactionsSchema );

module.exports = Transactions;
