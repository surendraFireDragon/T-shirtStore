const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
    merchantId:   's679ggyw6f9cvvqp',
    publicKey:    'd2qkqwyckj4p98kp',
    privateKey:   '862025e15ec5451c6b23abb985bb44b0'
});
// console.log("Eror sending the token");

exports.getToken = (req , res) =>{
    gateway.clientToken.generate({}, 
        (err, response) => {
           console.log("Eror sending the token 2 => ", err);
        // pass clientToken to your front-end
       if(err){
        console.log("Eror sending the token 2")
        res.status(500).json(err);
       }
       else{
            res.send(response);
       }
      });
}

exports.processPayment = (req , res) =>{
    let nonceFromClient = req.body.paymentMethodNonce;
    let amountFromClient  = req.body.amount;
    gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromClient,
        // deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, 
      (err, result) => {
          if(err){
              res.status(500).json(err);
          }else{
              res.json(result);
          }
      });
}