const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const sequelize = require("./database");
const { Pago, PagoTarjeta } = require("./models");

const app = express();

const stripe = new Stripe(
  "sk_test_51PVz1LP0Hf605oErraFcPMgy31oK5mA1xmBizYTF25D0U3BLH01LDl66Rnh5v6eUrCmNNFFs2XzVtEmKar7SeKWy00CrcbJ8FA"
);

app.use(cors());
app.use(express.json());

//Metodo GET
app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Pago.findAll({
      include: [
        {
          model: PagoTarjeta,
          as: "PagoTarjeta",
        },
      ],
    });
    res.json(payments); // Enviar la respuesta al cliente
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Metodo POST
app.post("/api/checkout", async (req, res) => {
  try {
    const { id, amount, cardDetails } = req.body;

    //* Verificar que el id y el amount no estén vacíos
    if (!id || !amount || !cardDetails) {
      return res
        .status(400)
        .send({ message: "Payment ID and amount are required" });
    }

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Gaming Keyboard",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Evitar métodos de pago que requieren redirección
      },
      return_url: "http://localhost:3000/payment-success", // URL de redirección después del pago
    });

    console.log(payment);

    //* Almacenar el pago en la base de datos
    const newPago = await Pago.create({
      monto: amount / 100,
      fecha: new Date(),
      tipo_pago_id: 1,
      usuario_id: 1,
      evento_id: 1,
    });

    await PagoTarjeta.create({
      numero_tarjeta: cardDetails.card.number,
      fecha_expiracion: cardDetails.card.exp,
      cvv: cardDetails.card.cvc,
      pago_id: newPago.pago_id,
    });

    res.send({ message: "Successful payment" });
  } catch (error) {
    console.log(error);
    const errorMessage =
      error.raw?.message || error.message || "Unknown error occurred";
    // console.error('Error creating payment intent:', error);
    res.status(500).json({ message: errorMessage });
    // res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Server on port", 3001);
  sequelize.sync();
});
