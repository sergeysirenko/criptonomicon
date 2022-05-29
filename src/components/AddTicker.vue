<template>
    <section>
        <div class="flex justify-center">
            <div class="max-w-xs">
                <div class="relative rounded-md shadow-md">
					<div v-if="isAddedTicker" class="text-sm text-red-600 absolute bottom-full left-0">{{ labels.this_ticker_is_already_added }}</div>
                    <input
                        v-model="ticker"
                        @keydown.enter="add(ticker)"
                        @keyup="find"
                        type="text"
                        name="wallet"
                        id="wallet"
                        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                        :placeholder="`${ labels.example } DOGE`"
                    />
					<div v-if="ticker.length" class="flex bg-white shadow-md p-1 rounded-md shadow-md absolute top-100 left-0">
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
        </div>

    </section>
</template>

<script>
import AddButton from '@/components/AddButton';
import { plus } from '@/svg-d'
import { languageLoader } from '@/language/getter';

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
    },

	emits: {
		'add-ticker': value => typeof value === 'string',
		'find-ticker': value => typeof value === 'string',
		'reset-ticker': null,
	},

    data() {
        return {
            ticker: '',
			labels: {},
			language: 'en',
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

	mounted() {
		this.loadLabels();
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

		loadLabels() {
			languageLoader( 'add-ticker', this.language )
				.then( labels => this.labels = labels )
				.catch( err => console.log( err ) );
		},
    },
}
</script>

<style scoped>

</style>