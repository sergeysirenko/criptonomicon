<template>
    <button
        type="button"
        class="inline-flex items-center py-1 px-4 mx-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
		:class="colorClass"
    >
        <svg v-if="icon" class="-ml-0.5 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#ffffff">
            <path :d="icon"></path>
        </svg>
		{{ innerText }}
    </button>
</template>

<script>
export default {
    name: "AddButton",

	props: {
		innerText: {
			type: String,
			default: '',
		},
		icon: {
			type: String,
		},
		colorClass: {
			type: String,
			default: 'bg-gray-600 hover:bg-gray-700',
		},
	},
}
</script>

<style scoped>

</style>