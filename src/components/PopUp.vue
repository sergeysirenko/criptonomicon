<template>
	<div>
		<div
			v-if="isPopupShow"
			@click="close"
			class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-30 flex items-center justify-center"
		></div>
		<div v-if="isPopupShow" class="popup z-50 flex flex-col justify-between bg-gray-100 overflow-hidden shadow rounded-lg border-purple-800 border-solid">
			<div class="px-4 py-5 sm:p-6 text-center">
				<h2>
					<slot name="header"></slot>
				</h2>
			</div>
			<div class="text-center">
				<slot name="main"></slot>
			</div>
			<div class="w-full flex justify-between py-2 px-2">
				<slot name="footer" :close="close" :confirm="confirm">
					<AddButton @click="close" :inner-text="labels.cancel"/>
					<AddButton
						@click="confirm"
						:icon="svg.checkout"
						:inner-text="labels.delete"
						color-class="bg-red-600 hover:bg-red-700"
						:class="{ 'opacity-50 cursor-not-allowed': !(youWantDelete === labels.delete) }"
					/>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
import AddButton from "@/components/AddButton";

export default {
	name: "PopUp",

	components: {
		AddButton,
	},

	emits: {
		'close-popup': null,
	},

	props: {
		isPopupShow: {
			type: Boolean,
			default: false
		},

		youWantDelete: {
			type: String,
			default: ''
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