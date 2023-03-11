/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

// TODO: Understand what this function do

/**
 * @description The webhooks of stripe works in a type of stream (lear more about this),
 * and for we understand here, we'll need to convert the stream data
 * of stripe webhook (for example) transforming in something readable
 *
 * Further details -> The next function is the default process to transform "stream data"
 * to something readable in the Node JS.
 * @param readable
 * @returns
 */
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const buf = await buffer(request);
    const secret = request.headers["stripe-signature"]; //the code screted that stripe webhook send to us

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret!,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      console.log("evento recebido", event);
    }

    response.json({ received: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};