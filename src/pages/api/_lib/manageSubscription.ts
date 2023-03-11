import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  // query to select only "ref" field and find the customer that is
  // make a subscription payment
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  // console.log("userRef +++ ", userRef);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  // console.log("subscriptionData +++ ", subscriptionData);

  if (createAction) {
    /**
     * If the app has more then one method for subscription, the app must have
     * a condition to difference 'customer.subscription.created' of the
     * 'checkout.session.completed' webhook.
     *
     * If not, the create query in fauna db will be duplicated, because the query
     * below will be triggered twice.
     */
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
