<template>
	<section class="flex justify-center">
		<div class="max-w-xs">
			<div class="relative rounded-md shadow-md h-full">
				<div v-if="isAddedTicker" class="text-sm text-red-600 absolute bottom-full left-0">{{ labels.this_ticker_is_already_added }}</div>
				<input
					v-model="ticker"
					@keydown.enter="add(ticker)"
					@keyup="find"
					type="text"
					name="wallet"
					id="wallet"
					class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md h-full dark:bg-slate-800 dark:text-white"
					:placeholder="`${ labels.example } DOGE`"
				/>
				<div v-if="ticker.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md absolute top-100 left-0 dark:bg-gray-600 dark:text-white">
					<span
						v-for="coin in coinsList"
						:key="coin.key"
						@click="add(coin)"
						class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
					>
						{{ coin }}
					</span>
				</div>
			</div>
		</div>
		<AddButton @click="add(ticker)" :icon="plus" :inner-text="labels.add"/>
	</section>
</template>

<script>
import AddButton from '@/components/AddButton';
import { plus } from '@/svg-d'

export default {
    name: "AddTicker",
    components: {
        AddButton,
    },

    props: {
        isAddedTicker: {
            type: Boolean,
			required: true,
            default: false,
        },

		isResetTicker: {
			type: Boolean,
			required: true,
		},

		coinsList: {
			type: Array,
			default: () => [],
		},

		labels: {
			type: Object,
			default: () => {},
		}
    },

	emits: {
		'add-ticker': value => typeof value === 'string',
		'find-ticker': value => typeof value === 'string',
		'reset-ticker': null,
	},

    data() {
        return {
            ticker: '',
			plus: plus,
        }
    },

	watch: {
		ticker() {
			this.resetTickerStatus();
		},

		isResetTicker() {
			this.ticker = '';
		},
	},

    methods: {
        add(ticker) {
            this.$emit('add-ticker', ticker);
        },

        find() {
            this.$emit('find-ticker', this.ticker)
        },

        resetTickerStatus() {
            this.$emit('reset-ticker')
        },
    },
}
</script>

<style scoped>

</style>