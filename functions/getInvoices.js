const functions = require("firebase-functions");

const stripe = require("stripe")("sk_test_w5Rr1z87iqq30IbxRKe5ssLO");

const cors = require("cors")({origin: true});

exports.getInvoices = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        stripe.paymentIntents.list({
          limit: request.body.limit,
          customer: request.body.customerId,
        })
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
