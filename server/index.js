const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();

const stripe = new Stripe("sk_test_51PVz1LP0Hf605oErraFcPMgy31oK5mA1xmBizYTF25D0U3BLH01LDl66Rnh5v6eUrCmNNFFs2XzVtEmKar7SeKWy00CrcbJ8FA");

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/checkout', async (req, res) => {
    try {
        const { id, amount } = req.body;
        
        //* Verificar que el id y el amount no estén vacíos
        if (!id || !amount) {
            return res.status(400).send({ message: 'Payment ID and amount are required' });
        }
    
        const payment = await stripe.paymentIntents.create({
            amount, 
            currency: 'USD',
            description: "Gaming Keyboard",
            payment_method: id,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never' // Evitar métodos de pago que requieren redirección
            },
            return_url: 'http://localhost:3000/payment-success' // URL de redirección después del pago
        });
    
        console.log(payment);

        res.send({ message: 'Successful payment' });
    } catch (error) {
        console.log(error);
        // console.error('Error creating payment intent:', error);
        res.json({message: error.raw.message})
        // res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
})

app.listen(3001, () => {
    console.log('Server on port', 3001);
})