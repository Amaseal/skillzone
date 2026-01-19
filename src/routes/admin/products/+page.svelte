<script lang="ts">
	export let data;
	export let form;

	let editingId: number | null = null;
	let showCreateForm = false;

	function startEdit(id: number) {
		editingId = id;
	}

	function cancelEdit() {
		editingId = null;
	}

	function formatPrice(cents: number) {
		return (cents / 100).toFixed(2);
	}
</script>

<div class="min-h-screen bg-slate-50 p-8 text-slate-900">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Produktu pārvaldība</h1>
			<div class="flex gap-4">
				<button
					on:click={() => (showCreateForm = !showCreateForm)}
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
				>
					{showCreateForm ? 'Atcelt' : '+ Jauns produkts'}
				</button>
				<a
					href="/admin"
					class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
				>
					← Atpakaļ
				</a>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-4 rounded-lg bg-green-50 p-4 text-green-800">Veiksmīgi saglabāts!</div>
		{/if}

		<!-- Create Form -->
		{#if showCreateForm}
			<div class="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
				<h2 class="mb-4 text-xl font-bold">Jauns produkts</h2>
				<form method="POST" action="?/create" class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-slate-700" for="create-name"
								>Nosaukums</label
							>
							<input
								id="create-name"
								name="name"
								type="text"
								required
								class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-slate-700" for="create-price"
								>Cena (centi)</label
							>
							<input
								id="create-price"
								name="pricePerZone"
								type="number"
								required
								placeholder="1500"
								class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-700" for="create-desc"
							>Apraksts</label
						>
						<textarea
							id="create-desc"
							name="description"
							rows="2"
							class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						></textarea>
					</div>
					<div class="flex gap-4">
						<label class="flex items-center gap-2">
							<input type="checkbox" name="requiresTrainer" value="true" class="rounded" />
							<span class="text-sm text-slate-700">Ar treneri</span>
						</label>
						<label class="flex items-center gap-2">
							<input type="checkbox" name="isWholeField" value="true" class="rounded" />
							<span class="text-sm text-slate-700">Viss laukums</span>
						</label>
					</div>
					<button
						type="submit"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
					>
						Izveidot
					</button>
				</form>
			</div>
		{/if}

		<!-- Products Table -->
		<div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
			<table class="min-w-full divide-y divide-slate-200">
				<thead class="bg-slate-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Nosaukums</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Cena</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Treneris</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Viss laukums</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Statuss</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
							>Darbības</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 bg-white">
					{#each data.products as product}
						{#if editingId === product.id}
							<tr class="bg-blue-50">
								<td colspan="6" class="px-6 py-4">
									<form method="POST" action="?/update" class="space-y-4">
										<input type="hidden" name="id" value={product.id} />
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="block text-sm font-medium text-slate-700">Nosaukums</label>
												<input
													name="name"
													type="text"
													value={product.name}
													required
													class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
											</div>
											<div>
												<label class="block text-sm font-medium text-slate-700">Cena (centi)</label>
												<input
													name="pricePerZone"
													type="number"
													value={product.pricePerZone}
													required
													class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
											</div>
										</div>
										<div>
											<label class="block text-sm font-medium text-slate-700">Apraksts</label>
											<textarea
												name="description"
												rows="2"
												class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												>{product.description || ''}</textarea
											>
										</div>
										<div class="flex gap-4">
											<label class="flex items-center gap-2">
												<input
													type="checkbox"
													name="requiresTrainer"
													value="true"
													checked={product.requiresTrainer}
													class="rounded"
												/>
												<span class="text-sm text-slate-700">Ar treneri</span>
											</label>
											<label class="flex items-center gap-2">
												<input
													type="checkbox"
													name="isWholeField"
													value="true"
													checked={product.isWholeField}
													class="rounded"
												/>
												<span class="text-sm text-slate-700">Viss laukums</span>
											</label>
											<label class="flex items-center gap-2">
												<input
													type="checkbox"
													name="active"
													value="true"
													checked={product.active}
													class="rounded"
												/>
												<span class="text-sm text-slate-700">Aktīvs</span>
											</label>
										</div>
										<div class="flex gap-2">
											<button
												type="submit"
												class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
											>
												Saglabāt
											</button>
											<button
												type="button"
												on:click={cancelEdit}
												class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
											>
												Atcelt
											</button>
										</div>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
									{product.name}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
									{formatPrice(product.pricePerZone)} EUR
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
									{product.requiresTrainer ? 'Jā' : 'Nē'}
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
									{product.isWholeField ? 'Jā' : 'Nē'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class={'inline-flex rounded-full px-2 text-xs leading-5 font-semibold ' +
											(product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
									>
										{product.active ? 'Aktīvs' : 'Neaktīvs'}
									</span>
								</td>
								<td class="px-6 py-4 text-sm whitespace-nowrap">
									<button
										on:click={() => startEdit(product.id)}
										class="text-blue-600 hover:text-blue-900"
									>
										Rediģēt
									</button>
									<form
										method="POST"
										action="?/delete"
										class="inline-block"
										on:submit|preventDefault={(e) => {
											if (
												confirm(
													'Vai tiešām vēlaties dzēst šo produktu? Tas neatgriezeniski izdzēsīs arī visas saistītās rezervācijas!'
												)
											) {
												e.currentTarget.submit();
											}
										}}
									>
										<input type="hidden" name="id" value={product.id} />
										<button type="submit" class="ml-2 text-red-600 hover:text-red-900">
											Dzēst
										</button>
									</form>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
