<template>
	<div class="toggle">
		<input type="checkbox" :checked="checked" id="toggle">
		<label for="toggle" />
	</div>
</template>

<script>
export default {
	name: "ToggleMode",

	props: {
		checked: {
			type: Boolean,
			default: false
		},
	},
}
</script>

<style lang="scss" scoped>
.toggle {
	align-self: center;
}

.toggle label {
	position: relative;
	display: block;
	width: 50px;
	height: 22px;
	background: #fff;
	border: 1px solid black;
	border-radius: 100px;
	cursor: pointer;

	&::before {
		position: absolute;
		width: 900px;
		height: 900px;
		background: var(--background);
		z-index: 10;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 100%;
		opacity: 1;
		transform: translate3d(-47%, 0, 0) scale(0.1);
		transition: background 300ms ease-in-out 200ms, opacity 350ms ease-in-out 200ms, transform 400ms ease-in-out;
		pointer-events: none;
		content: "";
		opacity: 0;
		z-index: -999;
	}

	&::after {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 4px;
		margin: auto;
		width: 14px;
		height: 14px;
		background: #fff;
		border: 1px solid black;
		content: "";
		border-radius: 100px;
		transition: background 200ms linear,
		transform 200ms ease-in-out 100ms;
	}
}

.toggle input {
	display: none;

	&:checked {
		~ label:after {
			background: #000;
			transform: translate3d(27px, 0, 0);
		}

		~ label:before {
			transform: translate3d(-84%, 23%, 0) scale(1);
			transition: background 300ms ease-in-out, opacity 30ms ease-in-out, transform 400ms ease-in-out;
			opacity: 1;
		}
	}
}
</style>