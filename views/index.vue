<template>
	<div class="bg-gray w-full min-h-screen pt-4 pb-4">
		<h1 class="text-white w-full text-center text-2xl font-bold">
			Rick and morty characters
		</h1>

		<div class="mt-4"></div>

		<div class="grid gap-3 grid-cols-12 max-w-2xl m-auto items-center">
			<div class="col-span-5">
				<v-text-field
					v-model="filterName"
					variant="solo-filled"
					:label="'Name'"
					hide-details
				/>
			</div>
			<div class="col-span-5">
				<v-select
					v-model="filterStatus"
					label="Status"
					variant="solo-filled"
					:items="['alive', 'dead', 'unknown']"
					hide-details
				></v-select>
			</div>
			<div class="col-span-2">
				<button class="bg-white p-2 rounded-lg" @click="filterAppliedTimes++">
					Apply filter
				</button>
			</div>
		</div>

		<div class="mt-4"></div>

		<template v-if="!charactersPending">
			<div
				v-for="character in characters"
				:key="character.id"
				class="max-w-2xl m-auto grid grid-cols-10 gap-3 mb-3"
			>
				<div class="col-span-1"></div>
				<div
					class="grid grid-cols-10 col-span-8 rounded-lg gap-3 bg-light-gray overflow-hidden relative"
				>
					<div class="col-span-4">
						<img class="block h-full object-cover" :src="character.image" />
					</div>
					<div class="col-span-6">
						<div class="mt-3"></div>
						<p class="font-bold text-xl text-white">{{ character.name }}</p>
						<span class="text-white"
							>{{ character.status }} - {{ character.species }}</span
						>

						<div class="mt-3"></div>

						<p class="text-lighten-gray">Last known location:</p>
						<span class="text-white">{{ character.location.name }}</span>

						<div class="mt-3"></div>

						<p class="text-lighten-gray">First seen in:</p>
						<span class="text-white">{{
							getEpisodeTitleByUrl(character.episode[0])
						}}</span>
					</div>
				</div>
				<div class="col-span-1"></div></div
		></template>
		<template v-if="charactersPending">
			<h1 class="text-white w-full text-center text-2xl font-bold">
				Hold on! It's loading...
			</h1></template
		>

		<div class="mt-4"></div>

		<div class="max-w-2xl m-auto">
			<v-pagination
				v-if="!charactersPending"
				v-model="page"
				color="white"
				:length="charactersResponse?.info.pages"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { CharactersResponse, EpisodeResponse } from "~/interface/index";

const config = useRuntimeConfig();
const apiPath = config.public.apiPath;
const page = ref(1);
const episodeTitles = ref<{ path: string; title: string }[]>([]);
const filterName = ref();
const filterStatus = ref();
const filterAppliedTimes = ref(0);

const currentLinkForChars = computed(() => {
	const url = new URL(`${apiPath}/character`);
	url.searchParams.set("page", page.value.toString());
	if (filterName.value)
		url.searchParams.set("name", filterName.value.toString());
	if (filterStatus.value)
		url.searchParams.set("status", filterStatus.value.toString());
	return url.toString();
});

const characters = computed(() =>
	charactersResponse.value
		? charactersResponse.value.results.map((person) => person)
		: []
);

const {
	data: charactersResponse,
	pending: charactersPending,
	execute: fetchCharactersRequest,
} = useAsyncData(
	"fetch-characters",
	(): Promise<CharactersResponse> => $fetch(currentLinkForChars.value),
	{ server: false, watch: [page, filterAppliedTimes], immediate: false }
);

onMounted(async () => {
	await fetchCharactersRequest();
	charactersResponse.value?.results.map(async (result) => {
		const episodeResponse = await useFetch<EpisodeResponse>(result.episode[0], {
			server: false,
		});
		episodeTitles.value.push({
			path: result.episode[0],
			title: episodeResponse.data.value?.name || "Episode title",
		});
	});
});

const getEpisodeTitleByUrl = (url: string) =>
	episodeTitles.value.find((episode) => episode.path === url)?.title ||
	"Episode title";
</script>
