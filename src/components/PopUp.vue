<template>
	<div>
		<div
			v-if="isPopupShow"
			@click="$emit('close-popup')"
			class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-30 flex items-center justify-center"
		></div>
		<div v-if="isPopupShow" class="popup z-50 flex flex-col justify-between bg-gray-100 overflow-hidden shadow rounded-lg border-purple-800 border-solid">
			<div class="px-4 py-5 sm:p-6 text-center">
				<h2>
					<slot name="header">Вы действительно хотите все удалить?</slot>
				</h2>
			</div>
			<div class="text-center">
				<slot name="main"></slot>
			</div>
			<div class="w-full flex justify-between py-2 px-2">
				<slot name="footer"></slot>
			</div>

		</div>
	</div>
</template>

<script>

export default {
	name: "PopUp",

	props: {
		isPopupShow: {
			type: Boolean,
			default: false
		},
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