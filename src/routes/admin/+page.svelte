<script lang="ts">
	export let data;
	$: reservations = data.reservations;

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString();
	}

	function formatDateTime(ts: Date | null) {
        if (!ts) return '-';
		return new Date(ts).toLocaleString();
	}

	// Helper to format time range based on duration
	function formatTimeRange(startTime: string, duration: number = 1) {
		if (duration === 1) return startTime;
		
		const timeSlots = [
			'08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
			'14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
			'20:00', '21:00'
		];
		
		const startIndex = timeSlots.indexOf(startTime);
		if (startIndex === -1) return startTime;
		
		const endIndex = startIndex + duration;
		if (endIndex >= timeSlots.length) {
			// Calculate end time if it goes beyond our slots
			const endHour = parseInt(startTime.split(':')[0]) + duration;
			return `${startTime}-${endHour.toString().padStart(2, '0')}:00`;
		}
		
		const endTime = timeSlots[endIndex];
		return `${startTime}-${endTime}`;
	}
</script>

<div class="min-h-screen bg-slate-50 p-8 text-slate-900">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Rezervācijas</h1>
			<div class="flex gap-4">
				<a
					href="/admin/products"
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
				>
					Produkti
				</a>
				<form method="POST" action="?/logout">
					<button
						type="submit"
						class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
					>
						Iziet
					</button>
				</form>
			</div>
		</div>

		<div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
			<table class="min-w-full divide-y divide-slate-200">
				<thead class="bg-slate-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statuss</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Laiks</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rezervētais Laiks</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Klients</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">E-pasts</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Izveidots</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Darbības</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 bg-white">
					{#each reservations as r}
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class={'inline-flex rounded-full px-2 text-xs font-semibold leading-5 ' +
										(r.status === 'paid'
											? 'bg-green-100 text-green-800'
											: r.status === 'cancelled'
											? 'bg-red-100 text-red-800'
											: 'bg-yellow-100 text-yellow-800')}
								>
									{r.status.toUpperCase()}
								</span>
							</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
								{r.date}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
								{formatTimeRange(r.time, r.duration)}
								{#if r.duration && r.duration > 1}
									<span class="ml-2 text-xs text-slate-500">({r.duration}h)</span>
								{/if}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
								{r.name}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
								{r.email}
							</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
								{formatDateTime(r.createdAt)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm">
								<form method="POST" action="?/delete" class="inline">
									<input type="hidden" name="id" value={r.id} />
									<button
										type="submit"
										class="text-red-600 hover:text-red-900"
										on:click={(e) => {
						if (!confirm('Vai tiešām vēlaties dzēst šo rezervāciju?')) {
							e.preventDefault();
						}
					}}
									>
										Dzēst
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
