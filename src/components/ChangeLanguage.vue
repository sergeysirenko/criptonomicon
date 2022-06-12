<template>
	<select @change="change" class="dark:bg-slate-800 dark:text-white">
		<option v-for="item in languageList"
			:key="item.key"
			:value="item.key"
			:selected="getLanguage() === item.key"
		>
			{{ item.language }}
		</option>
	</select>
</template>

<script>
export default {
	name: "ChangeLanguage",

	props: {
		languageList: {
			type: Array,
		},
	},

	methods: {
		change(event) {
			localStorage.setItem('criptonomicon-language', event.target.value);
			this.$emit('change-language', event.target.value)
		},

		getLanguage() {
			return localStorage.getItem('criptonomicon-language');
		}
	},
}
</script>

<style scoped>

</style>