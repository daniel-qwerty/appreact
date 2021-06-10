const functions = require("firebase-functions");

const stripe = require("stripe")("sk_test_w5Rr1z87iqq30IbxRKe5ssLO");

const cors = require("cors")({origin: true});

exports.updateCustomer = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        stripe.customers.update(
            request.body.customerId,
            {
              email: request.body.email,
              name: request.body.name,
              phone: request.body.phone,
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
