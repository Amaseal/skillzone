<script>
	import logo from '$lib/assets/skillazone.svg';
	import background from '$lib/assets/463871-top-ice-hockey-backgrounds-1920x1200-ipad-pro.jpg';
</script>

<svelte:head>
	<title>Skillzone - hokeja trenniņu arēna</title>
</svelte:head>

<section
	class="flex min-h-screen items-center justify-center bg-cover bg-center"
	style="background-image: url('{background}');"
>
	<div
		class="relative container mx-auto flex flex-col items-center justify-center rounded-xl bg-blue-600/80 p-20 text-center"
	>
		<img src={logo} alt="Skill Zone Hockey Logo" class="mb-6 h-24" />

		<h1 class="mb-5 text-5xl font-bold text-white uppercase md:text-9xl">Jau drīzumā!</h1>
		<p class="mb-5 text-3xl text-white">
			Jau pavisam drīz atvērsies lielākā mākslīgā ledus hokeja treniņu arēna Baltijā!
		</p>
		<p class="text-3xl text-white">Vairāk info:</p>
		<p class="flex flex-col text-3xl text-white md:flex-row md:gap-6">
			<span>+371 28309220</span> <span>+371 26463175</span> <span>+371 28380420</span>
		</p>
	</div>
</section>
