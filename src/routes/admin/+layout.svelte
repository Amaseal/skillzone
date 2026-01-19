<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-full">
	<nav class="border-b border-slate-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex flex-shrink-0 items-center">
						<span class="text-xl font-bold text-slate-900">SkillZone Admin</span>
					</div>
					<div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
						<a
							href="/admin"
							class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium {$page.url
								.pathname === '/admin'
								? 'border-blue-500 text-slate-900'
								: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
						>
							Rezervācijas
						</a>
						<a
							href="/admin/products"
							class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium {$page.url.pathname.startsWith(
								'/admin/products'
							)
								? 'border-blue-500 text-slate-900'
								: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
						>
							Produkti
						</a>
						<a
							href="/admin/settings"
							class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium {$page.url.pathname.startsWith(
								'/admin/settings'
							)
								? 'border-blue-500 text-slate-900'
								: 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}"
						>
							Iestatījumi
						</a>
					</div>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:items-center">
					<form action="/admin?/logout" method="POST">
						<button type="submit" class="text-sm font-medium text-slate-500 hover:text-slate-700">
							Iziet
						</button>
					</form>
				</div>
			</div>
		</div>
	</nav>

	<div class="py-10">
		<main>
			<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</div>
