<script lang="ts">
	export let title: string;
	export let price: string;
	export let details: string | undefined;
	export let highlight = false;
	export let description: string | undefined = undefined;
	/** Optional bullet points shown under the price. */
	export let bullets: string[] = [];
	/** Currency label under the price. */
	export let currency: string = 'EUR';
</script>

<div
	class={'rounded-2xl border p-6 shadow-sm ' +
		(highlight
			? 'scale-110 border-lime-400 bg-lime-400 ring-1 ring-lime-400'
			: 'border-slate-200 bg-white')}
>
	<div class="flex h-[250px] flex-col">
		<!-- Header -->
		<div>
			<h3 class="text-lg font-semibold text-slate-900">{title}</h3>
			{#if details}
				<p class="mt-1 text-sm text-slate-600">{details}</p>
			{/if}
			{#if description}
				<p class="mt-2 text-sm text-slate-700">{description}</p>
			{/if}
		</div>

		<!-- Bullets / footer -->
		<div class="mt-6 flex-1">
			{#if bullets?.length}
				<ul class="space-y-2 text-sm text-slate-900">
					{#each bullets as b (b)}
						<li class="flex gap-2">
							<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"></span>
							<span>{b}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Big centered price -->
		<div class="mt-6 flex flex-col items-center justify-center text-center">
			<div class="flex items-end gap-2">
				<p class="text-5xl leading-none font-extrabold text-slate-900">{price}</p>
				<p class="pb-1 text-sm font-semibold text-slate-800">{currency}</p>
			</div>
		</div>
	</div>
</div>
