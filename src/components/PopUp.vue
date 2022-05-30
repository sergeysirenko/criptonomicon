<template>
	<div v-if="isPopupShow">
		<div
			@click="close"
			class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-30 flex items-center justify-center"
		></div>
		<div class="popup z-50 flex flex-col justify-between bg-gray-100 overflow-hidden shadow rounded-lg border-purple-800 border-solid">
			<div class="px-4 py-5 sm:p-6 text-center">
				<h2>
					<slot name="header"></slot>
				</h2>
			</div>
			<div class="text-center">
				<slot name="main"></slot>
			</div>
			<div class="w-full flex justify-between py-2 px-2">
				<slot name="footer" :close="close"></slot>
			</div>
		</div>
	</div>
</template>

<script>
import { checkout } from "@/svg-d";

export default {
	name: "PopUp",

	data() {
		return {
			svg: {
				checkout: checkout,
			},
		}
	},

	emits: {
		'close-popup': null,
	},

	props: {
		isPopupShow: {
			type: Boolean,
			default: false
		},
	},

	mounted() {
		document.addEventListener('keydown', this.checkEscape)
	},

	methods: {
		close() {
			this.$emit('close-popup')
		},

		confirm() {
			this.$emit('confirm-popup')
		},

		checkEscape(e) {
			if(this.isPopupShow && e.key === 'Escape') {
				this.close();
			}
		},
	},
	
	beforeUnmount() {
		document.removeEventListener('keydown', this.checkEscape)
	},
}
</script>

<style scoped>
	.popup {
		width: 330px;
		height: 330px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>