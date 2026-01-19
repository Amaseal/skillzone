<script lang="ts">
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let openingHour = data.openingHour;
	let closingHour = data.closingHour;
	let adminEmail = data.adminEmail;

	// Helper to generate hours (00:00 to 23:00)
	const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
</script>

<div class="px-4 py-8 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl leading-6 font-semibold text-slate-900">Iestatījumi</h1>
			<p class="mt-2 text-sm text-slate-700">Konfigurējiet SkillZone darba laiku un paziņojumus.</p>
		</div>
	</div>

	{#if form?.success}
		<div class="mt-4 rounded-md bg-green-50 p-4 text-green-700">
			Iestatījumi veiksmīgi saglabāti!
		</div>
	{/if}

	<form method="POST" class="mt-8 max-w-xl space-y-6">
		<div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div class="md:grid md:grid-cols-3 md:gap-6">
				<div class="md:col-span-1">
					<h3 class="text-base leading-6 font-semibold text-slate-900">Darba laiks</h3>
					<p class="mt-1 text-sm text-slate-500">
						Norādiet laika intervālu, kurā klienti var veikt rezervācijas.
					</p>
				</div>
				<div class="mt-5 space-y-4 md:col-span-2 md:mt-0">
					<div>
						<label for="openingHour" class="block text-sm leading-6 font-medium text-slate-900"
							>Atveras</label
						>
						<select
							id="openingHour"
							name="openingHour"
							bind:value={openingHour}
							class="mt-2 block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-slate-900 ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
						>
							{#each hours as hour}
								<option value={hour}>{hour}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="closingHour" class="block text-sm leading-6 font-medium text-slate-900"
							>Aizveras</label
						>
						<select
							id="closingHour"
							name="closingHour"
							bind:value={closingHour}
							class="mt-2 block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-slate-900 ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
						>
							{#each hours as hour}
								<option value={hour}>{hour}</option>
							{/each}
						</select>
						<p class="mt-2 text-xs text-slate-500">Pēdējā rezervācija beigsies šajā laikā.</p>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
			<div class="md:grid md:grid-cols-3 md:gap-6">
				<div class="md:col-span-1">
					<h3 class="text-base leading-6 font-semibold text-slate-900">Paziņojumi</h3>
					<p class="mt-1 text-sm text-slate-500">
						Uz šo e-pastu tiks sūtīti paziņojumi par jaunām rezervācijām.
					</p>
				</div>
				<div class="mt-5 md:col-span-2 md:mt-0">
					<label for="adminEmail" class="block text-sm leading-6 font-medium text-slate-900"
						>Admin E-pasts</label
					>
					<input
						type="email"
						name="adminEmail"
						id="adminEmail"
						bind:value={adminEmail}
						class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 text-slate-900 shadow-sm ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6"
					/>
				</div>
			</div>
		</div>

		<div class="flex justify-end">
			<button
				type="submit"
				class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				Saglabāt
			</button>
		</div>
	</form>
</div>
