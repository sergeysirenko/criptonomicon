<template>
    <section>
        <div class="flex justify-center">
            <div class="max-w-xs">
<!--                <label for="wallet" class="block text-sm font-medium text-gray-700">Тикер {{ ticker }}</label>-->
                <div class="relative rounded-md shadow-md">
                    <input
                        v-model="ticker"
                        @keydown.enter="add(ticker)"
                        @keyup="find"
                        type="text"
                        name="wallet"
                        id="wallet"
                        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                        placeholder="Например DOGE"
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

                <div v-if="isAddedTicker" class="text-sm text-red-600">Такой тикер уже добавлен</div>
            </div>
			<AddButton @click="add(ticker)" />
        </div>

    </section>
</template>

<script>
import AddButton from '@/components/AddButton';

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
        }
    },

	watch: {
		ticker() {
			this.resetTickerStatus();
		},
	},

    methods: {
        add(ticker) {
            this.$emit('add-ticker', ticker);
            this.ticker = '';
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