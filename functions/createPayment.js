const functions = require("firebase-functions");

const stripe = require("stripe")("sk_test_w5Rr1z87iqq30IbxRKe5ssLO");

const cors = require("cors")({origin: true});

exports.createPayment = functions.https.onRequest(
    (request, response) => {
      cors(request, response, () => {
        stripe.paymentIntents
            .create({
              amount: request.body.amount,
              currency: "usd",
              confirm: true,
              payment_method_types: ["card"],
              payment_method: request.body.paymentMethod,
              customer: request.body.customerId,
              description: request.body.description,
              confirmation_method: "manual",
            })
            .then((charge) => {
              response.send(charge);
            })
            .catch((error) => {
              console.log(error);
              response.send(error);
              console.log(request.body);
            });
      });
    }
);
