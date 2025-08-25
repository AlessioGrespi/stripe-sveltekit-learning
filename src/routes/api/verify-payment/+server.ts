import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET({ url }) {
	const sessionId = url.searchParams.get('session_id');
	
	if (!sessionId) {
		return json({ error: 'No session ID provided' }, { status: 400 });
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		
		console.log('Payment verification for session:', sessionId);
		console.log('Session details:', JSON.stringify(session, null, 2));
		
		return json({
			verified: true,
			session: {
				id: session.id,
				amount_total: session.amount_total,
				currency: session.currency,
				payment_status: session.payment_status,
				customer_email: session.customer_details?.email,
				created: session.created
			}
		});
	} catch (error) {
		console.error('Error verifying payment:', error);
		return json({ error: 'Failed to verify payment' }, { status: 500 });
	}
}
