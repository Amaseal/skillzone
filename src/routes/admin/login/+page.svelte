<script lang="ts">
	export let form;
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
				Admin Login
			</h2>
		</div>
		<form class="mt-8 space-y-6" method="POST" action="?/login">
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="password" class="sr-only">Parole</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="relative block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-3"
						placeholder="Parole"
					/>
				</div>
			</div>

			{#if form?.incorrect}
				<p class="text-center text-sm text-red-600">Nepareiza parole</p>
			{/if}

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Ienākt
				</button>
			</div>
		</form>
	</div>
</div>
