<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	// Get the session_id from the URL query parameters
	$: sessionId = $page.url.searchParams.get('session_id');
	
	let paymentDetails = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		if (sessionId) {
			try {
				const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
				const data = await response.json();
				
				if (data.error) {
					error = data.error;
				} else {
					paymentDetails = data.session;
					console.log('Payment verified successfully:', data.session);
				}
			} catch (err) {
				error = 'Failed to verify payment';
				console.error('Verification error:', err);
			} finally {
				loading = false;
			}
		}
	});
</script>

<main>
	<div class="success-container">
		<h1>Payment Successful! 🎉</h1>
		<p>Thank you for your purchase!</p>
		
		{#if sessionId}
			<div class="session-info">
				<p><strong>Session ID:</strong> {sessionId}</p>
			</div>
		{/if}

		{#if loading}
			<div class="loading">Verifying payment...</div>
		{:else if error}
			<div class="error">Error: {error}</div>
		{:else if paymentDetails}
			<div class="payment-details">
				<h3>Payment Details:</h3>
				<p><strong>Amount:</strong> ${(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency.toUpperCase()}</p>
				<p><strong>Status:</strong> {paymentDetails.payment_status}</p>
				<p><strong>Customer Email:</strong> {paymentDetails.customer_email || 'Not provided'}</p>
				<p><strong>Date:</strong> {new Date(paymentDetails.created * 1000).toLocaleString()}</p>
			</div>
		{/if}
		
		<a href="/" class="back-button">Back to Home</a>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 2rem;
	}

	.success-container {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem;
		border: 2px solid #10b981;
		border-radius: 8px;
		background: #f0fdf4;
	}

	.session-info {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		margin: 1rem 0;
		text-align: left;
	}

	.payment-details {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		margin: 1rem 0;
		text-align: left;
	}

	.loading {
		color: #059669;
		font-style: italic;
		margin: 1rem 0;
	}

	.error {
		color: #dc2626;
		background: #fef2f2;
		padding: 1rem;
		border-radius: 6px;
		margin: 1rem 0;
	}

	.back-button {
		display: inline-block;
		background: #10b981;
		color: white;
		text-decoration: none;
		padding: 12px 24px;
		border-radius: 6px;
		margin-top: 1rem;
		transition: background 0.2s;
	}

	.back-button:hover {
		background: #059669;
	}
</style>
