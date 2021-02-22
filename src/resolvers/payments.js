// STRIPE_SECRET_KEY currently not in use, will be removed
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentsResolvers = {
  Mutation: {
    async postPayment(root, { unitAmount, quantity }) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'Toque',
              },
              // stripe operates in cents
              unit_amount: unitAmount * 100,
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });
      return {
        id: session.id,
      };
    },
  },
};

exports.paymentsResolvers = paymentsResolvers;
