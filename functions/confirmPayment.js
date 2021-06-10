const functions = require("firebase-functions");

const stripe = require("stripe")("sk_test_w5Rr1z87iqq30IbxRKe5ssLO");

const cors = require("cors")({origin: true});

exports.confirmPayment = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        stripe.paymentIntents.confirm(
            request.body.clientSecret,
            {
              payment_method: request.body.paymentMethod,
            }
        )
            .then((charge) => {
              response.send(charge);
            })
            .catch((error) => {
              console.log(error);
              response.send(error);
            });
      });
    }
);
