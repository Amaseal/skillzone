<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let show = false;
	export let product: any = null;

	let date = '';
	let time = '';
	let duration = 1; // Number of hours (1-4)
	let name = '';
	let email = '';
	let loading = false;
	let loadingSlots = false;
	let availability: Record<string, number[]> = {};

	// Selected Zones
	let selectedZones: number[] = [];

	// Zones 1-8
	const allZones = Array.from({ length: 8 }, (_, i) => i + 1);

	// Helper function to get consecutive time slots
	function getConsecutiveSlots(startTime: string, hours: number): string[] {
		const startIndex = timeSlots.indexOf(startTime);
		if (startIndex === -1) return [];
		return timeSlots.slice(startIndex, startIndex + hours);
	}

	// Helper function to check if we have enough consecutive slots
	function hasEnoughConsecutiveSlots(startTime: string, hours: number): boolean {
		const slots = getConsecutiveSlots(startTime, hours);
		return slots.length === hours;
	}

	// Determine if it is a "Full Field" booking
	$: isWholeField = product?.isWholeField || false;

	// If Full Field, auto-select all zones
	$: if (isWholeField) {
		selectedZones = [...allZones];
	}

	// Calculate total price dynamically (base price × duration)
	$: totalPrice = product && selectedZones.length > 0
		? isWholeField
			? (product.pricePerZone / 100) * duration // Fixed price for whole field × duration
			: (product.pricePerZone / 100) * selectedZones.length * duration // Price per zone × duration
		: 0;

	let timeSlots: string[] = [];
	let workingHoursInfo = '';

	async function checkAvailability() {

		if (!date) return;
		loadingSlots = true;
		try {
			const res = await fetch(`/api/reservations/check?date=${date}`);
			const data = await res.json();
			availability = data.availability || {};
			console.log('[ReservationModal] Received availability:', availability);
			
			// Set time slots from working hours
			if (data.workingHours) {
				const { start, end } = data.workingHours;
				timeSlots = [];
				const startHour = parseInt(start.split(':')[0]);
				const endHour = parseInt(end.split(':')[0]);
				
				for (let h = startHour; h < endHour; h++) {
					timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
				}
				workingHoursInfo = `Rezervācijas iespējams veikt darba laikā (${start} - ${end}).`;
			}
			console.log('[ReservationModal] Final TimeSlots:', timeSlots);
			
			time = ''; // Reset time selection
			if (!isWholeField) selectedZones = []; // Reset zones on date change for individual
		} catch (e) {
			console.error(e);
		} finally {
			loadingSlots = false;
		}
	}

	function isTimeSlotDisabled(slot: string) {
		// Check if we have enough consecutive slots
		if (!hasEnoughConsecutiveSlots(slot, duration)) {
			return true;
		}

		// Check availability for all consecutive slots
		const consecutiveSlots = getConsecutiveSlots(slot, duration);
		for (const timeSlot of consecutiveSlots) {
			const booked = availability[timeSlot] || [];
			if (isWholeField) {
				// If we want full field, time is disabled if ANY zone is taken in ANY slot
				if (booked.length > 0) return true;
			} else {
				// If individual, time disabled only if ALL zones are taken in ANY slot
				if (booked.length === allZones.length) return true;
			}
		}
		return false;
	}

	function isZoneDisabled(zone: number) {
		if (!time) return true;
		
		// Check availability for all consecutive slots
		const consecutiveSlots = getConsecutiveSlots(time, duration);
		for (const timeSlot of consecutiveSlots) {
			const booked = availability[timeSlot] || [];
			if (booked.includes(zone)) return true;
		}
		
		return false;
	}

	function toggleZone(zone: number) {
		if (isWholeField) return;
		if (selectedZones.includes(zone)) {
			selectedZones = selectedZones.filter((z) => z !== zone);
		} else {
			selectedZones = [...selectedZones, zone];
		}
	}

	async function handleSubmit() {
		if (!date || !time || !name || !email) {
			alert('Lūdzu aizpildiet visus laukus!');
			return;
		}
		if (selectedZones.length === 0) {
			alert('Lūdzu izvēlieties vismaz vienu zonu!');
			return;
		}
		if (!product) {
			alert('Produkts nav izvēlēts!');
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				body: JSON.stringify({
					productId: product.id,
					date,
					time,
					duration,
					name,
					email,
					zones: selectedZones,
					totalPrice: Math.round(totalPrice * 100) // Convert to cents
				}),
				headers: { 'content-type': 'application/json' }
			});
			const { url, error } = await res.json();
			if (error) {
				alert('Kļūda: ' + error);
			} else if (url) {
				window.location.href = url;
			}
		} catch (e) {
			console.error(e);
			alert('Notika kļūda.');
		} finally {
			loading = false;
		}
	}

	function close() {
		show = false;
		dispatch('close');
	}
</script>

{#if show && product}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
		transition:fade
		onclick={close}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Escape' && close()}
	>
		<div
			class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
			transition:scale
			onclick={(e) => e.stopPropagation()}
            role="presentation"
		>
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-slate-900">Rezervēt: {product.name}</h2>
				<button onclick={close} class="text-slate-400 hover:text-slate-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="space-y-4">

				<!-- Date Picker -->
				<div>
					<label class="block text-sm font-medium text-slate-700" for="date">Datums</label>
					<input
						id="date"
						type="date"
						bind:value={date}
						onchange={checkAvailability}
						min={new Date().toISOString().split('T')[0]}
						class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
					/>
				</div>

				<!-- Duration Selector -->
				<div>
					<div class="block text-sm font-medium text-slate-700">Ilgums</div>
					<div class="mt-2 grid grid-cols-4 gap-2">
						{#each [1, 2, 3, 4] as hours}
							<button
								type="button"
								class={'rounded border py-2 text-sm font-medium transition ' +
									(duration === hours
										? 'bg-blue-600 text-white border-blue-600'
										: 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-500')}
								onclick={() => {
									duration = hours;
									time = ''; // Reset time when duration changes
									if (!isWholeField) selectedZones = [];
								}}
							>
								{hours} {hours === 1 ? 'stunda' : 'stundas'}
							</button>
						{/each}
					</div>
				</div>

				<!-- Time Slots -->
				{#if date}
					<div>
						<div class="block text-sm font-medium text-slate-700">Laiks</div>
						<p class="text-xs text-slate-500 mb-2">Rezervācijas iespējamas veikt darba laikā līdz 21:00.</p>
						{#if loadingSlots}
							<p class="text-sm text-slate-500">Meklē brīvos laikus...</p>
						{:else}
							<div class="mt-2 grid grid-cols-4 gap-2">
								{#each timeSlots as slot}
									<button
										class={'rounded border py-2 text-sm font-medium transition ' +
											(isTimeSlotDisabled(slot)
												? 'bg-slate-100 text-slate-400 cursor-not-allowed'
												: time === slot
												? 'bg-blue-600 text-white border-blue-600'
												: 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-500')}
										disabled={isTimeSlotDisabled(slot)}
										onclick={() => {
											time = slot;
											if (!isWholeField) selectedZones = [];
										}}
									>
										{slot}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<!-- Zone Selector (Only show if time selected and NOT full field) -->
				{#if time && !isWholeField}
					<div>
						<label class="block text-sm font-medium text-slate-700">Zonu izvēle</label>
						<p class="text-xs text-slate-500 mb-2">Izvēlieties vienu vai vairākas zonas.</p>
						<div class="grid grid-cols-4 gap-2">
							{#each allZones as zone}
								<button
									class={'rounded border py-2 text-sm font-medium transition ' +
										(isZoneDisabled(zone)
											? 'bg-slate-100 text-slate-400 cursor-not-allowed'
											: selectedZones.includes(zone)
											? 'bg-blue-600 text-white border-blue-600'
											: 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-500')}
									disabled={isZoneDisabled(zone)}
									onclick={() => toggleZone(zone)}
								>
									Zona {zone}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Zone Info Display (For full field) -->
				{#if time && isWholeField}
					<div class="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
						Tiek rezervēts viss laukums (Zonas 1-8).
					</div>
				{/if}

				<!-- Price Display -->
				{#if selectedZones.length > 0}
					<div class="p-4 bg-slate-50 rounded-lg">
						<div class="flex justify-between items-center">
							<span class="text-sm font-medium text-slate-700">Kopējā cena:</span>
							<span class="text-2xl font-bold text-slate-900">{totalPrice.toFixed(2)} EUR</span>
						</div>
						{#if !isWholeField}
							<p class="text-xs text-slate-500 mt-1">
								{selectedZones.length} zona{selectedZones.length > 1 ? 's' : ''} × {product.pricePerZone / 100} EUR × {duration} {duration === 1 ? 'stunda' : 'stundas'}
							</p>
						{:else}
							<p class="text-xs text-slate-500 mt-1">
								{product.pricePerZone / 100} EUR × {duration} {duration === 1 ? 'stunda' : 'stundas'}
							</p>
						{/if}
					</div>
				{/if}

				<!-- Contact Info -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-slate-700" for="name">Vārds</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-700" for="email">E-pasts</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
						/>
					</div>
				</div>

				<div class="mt-6">
					<button
						onclick={handleSubmit}
						disabled={loading || !time || selectedZones.length === 0}
						class="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Apstrādā...' : `Turpināt uz apmaksu (${totalPrice.toFixed(2)} EUR)`}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
