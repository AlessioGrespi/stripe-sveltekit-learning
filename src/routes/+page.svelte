<script>
	let loading = false;

	async function handleCheckout() {
		loading = true;
		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const { url, error } = await response.json();
			
			if (error) {
				console.error('Error:', error);
				return;
			}

			// Redirect to Stripe checkout
			window.location.href = url;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<main>
	<h1>Stripe Checkout Demo</h1>
	<p>Click the button below to test Stripe checkout:</p>
	
	<button 
		on:click={handleCheckout} 
		disabled={loading}
		class="checkout-button"
	>
		{loading ? 'Creating checkout...' : 'Buy Demo Product ($20.00)'}
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 2rem;
	}

	.checkout-button {
		background: #6772e5;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.checkout-button:hover:not(:disabled) {
		background: #5469d4;
	}

	.checkout-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>