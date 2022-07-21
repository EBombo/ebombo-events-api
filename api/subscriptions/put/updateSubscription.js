const logger = require("../../../utils/logger");
const { stripe } = require('../../../config');

const PRORATION_BEHAVIOR = "create_prorations";

const updateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const { priceId } = req.body;

    if (!priceId) throw new Error("No priceId provided");

    logger.log(`update subscription ${subscriptionId} -> to price ${priceId}`);

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    console.log(`subscription ${subscription.id}`);

    const subscriptionUpdated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: PRORATION_BEHAVIOR,
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }]
    });

    return res.send({ success: true, subscriptionUpdated: subscriptionUpdated });
  } catch (error) {
    console.error("update subscription error->", error.message);
    return res.status(409).send({error: error.message});
  }

};

module.exports = { updateSubscription };

