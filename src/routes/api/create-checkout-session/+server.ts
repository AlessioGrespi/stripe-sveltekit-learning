import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST() {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'gbp',
						product_data: {
							name: 'Demo Product',
							description: 'This is a demo product for testing Stripe checkout'
						},
						unit_amount: 2000 // $20.00 in cents
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${process.env.ORIGIN || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.ORIGIN || 'http://localhost:5173'}/cancel`
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
}