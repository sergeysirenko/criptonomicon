<template>
	<div class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-30 flex items-center justify-center"></div>
	<div class="popup fixed z-40 rounded-md">

	</div>
</template>

<script>
export default {
	name: "PopUp"
}
</script>

<style scoped>
	.popup {
		width: 300px;
		height: 300px;
		background-color: black;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>