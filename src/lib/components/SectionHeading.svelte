<script lang="ts">
	export let eyebrow: string | undefined;
	export let title: string;
	export let subtitle: string | undefined = undefined;
	export let color: string | undefined = undefined;
	export let subtextColor: string | undefined = undefined;
</script>

<div class="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
	{#if eyebrow}
		<p class="mb-3 rounded-lg bg-lime-400 px-2 py-1 text-xs font-semibold text-black uppercase">
			{eyebrow}
		</p>
	{/if}
	<h2 class="text-3xl font-bold tracking-tight {color ?? 'text-blue-600'} uppercase md:text-5xl">
		{title}
	</h2>
	{#if subtitle}
		<p class="mt-4 text-base leading-relaxed {subtextColor ?? 'text-slate-600'}">{subtitle}</p>
	{/if}
</div>
