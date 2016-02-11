'use strict';

/*global Stripe:true*/
/*global $form:true*/

//set Public key for Stripe payments
Stripe.setPublishableKey('pk_test_hj5zUfO42Wo87r9Gb6Ge7vfH');
var isSubmit = false;


$(document).ready( function() {
    $('#submittransaction').click(function () {
        if ( !isSubmit ) {
            Stripe.card.createToken( {
                number: $('.card-number' ).val(),
                cvc: $('.card-cvc' ).val(),
                exp_month: $('.card-expiry-month' ).val(),
                exp_year: $('.card-expiry-year').val(),
               
                currency: $('#currency').val()
            }, function( status, response ) {
                if ( response.error ) {
                    // Show the errors on the form
                    $( '.payment-errors' ).text( response.error.message );
                }
                else {
                    // response contains id and card, which contains additional card details
                    var token2 = response.id;
                    // Insert the token into the form so it gets submitted to the server
                    $("form").append($('<input type="hidden" name="stripeToken" />').val(token2));
                    // and submit
                    $.ajax( {
                        url: '/createtransaction',
                        type: 'POST',
                        headers: {
                            'x-access-token': encodeURIComponent($('#token').html())
                        },
                        data: {
                            amount: $( '#amount' ).val(),
                            currency: $( '#currency' ).val(),
                            token: token2,
                            username: encodeURIComponent($('#username').text())
                        }
                    }).done(function (response) {
                        if ( response.message ) {
                            $( '.payment-errors' ).text( response.message );
                        }
                    })
                    .error(function (error) { debugger; })
                    ;
                }

            } );
        }

    });
    
} );
