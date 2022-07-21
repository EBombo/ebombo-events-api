const logger = require("../../../../utils/logger");
const { stripe } = require("../../../../config");

const reviewUpdateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    // Field customerId is the ID stripe uses to identify the user/company.
    // Field priceId is the new price to switch.
    const { priceId, customerId } = req.query;

    if (!priceId) throw new Error("No priceId provided");
    if (!customerId) throw new Error("No customerId provided");

    logger.log(`Review of subscription update ${subscriptionId} -> to price ${priceId}`);

    // Set proration date to this moment:
    const proration_date = Math.floor(Date.now() / 1000);

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    console.log(`subscription ${subscription.id}`);

    // See what the next invoice would look like with a price switch
    // and proration set:
    const items = [{
      id: subscription.items.data[0].id,
      price: priceId, 
    }];

    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId,
      subscription: subscriptionId,
      subscription_items: items,
      subscription_proration_date: proration_date,
    });

    return res.send({ success: true, invoice: invoice });
  } catch (error) {
    console.error("review subscription update error->", error.message);
    return res.status(409).send({error: error.message});
  }
};

module.exports = { reviewUpdateSubscription };

