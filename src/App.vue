<template>
    <div v-if="isHidePreloader" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" :d="svg.circle"></path>
        </svg>
    </div>
    <div class="container">

        <AddTicker
            @add-ticker="add"
            @find-ticker="find"
            @reset-ticker="resetTicker"
            :coins-list="coinsList"
            :is-added-ticker="isAddedTicker"
			:is-reset-ticker="isResetTicker"
        />

        <template v-if="tickers.length">
            <hr class="w-full border-t border-gray-600 my-4" />
            <div class="flex flex-wrap justify-center md:justify-between">
                <div class="flex items-center">{{ labels.filter }}: <input v-model="filter" class="border rounded-md ml-1"/></div>
				<div v-if="tickers.length > 6" class="flex items-center p-2 md:p-0">
					<p>{{ labels.page }} {{ page }} {{ labels.from }} {{ Math.ceil(tickers.length / 6) }}</p>
					<button
						class="mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						:disabled="page <= 1"
						:class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
						@click="page -= 1"
					>
						{{ labels.back }}
					</button>
					<button
						class="mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						@click="page = Number(page) + 1"
						:disabled="!hasNextPage"
						:class="{ 'opacity-50 cursor-not-allowed': !hasNextPage }"
					>
						{{ labels.forward }}
					</button>
				</div>
            </div>
            <hr class="w-full border-t border-gray-600 my-4" />
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div
                    v-for="ticker in paginatedTickers"
                    :key="ticker.name"
                    @click="select(ticker)"
                    :class="{ 'border-4': selectedTicker === ticker }"
                    class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
                >
                    <div class="px-4 py-5 sm:p-6 text-center" :class="{ 'bg-red-100' : ticker.price === '-'}">
                        <dt class="text-sm font-medium text-gray-500 truncate">{{ ticker.name }} - USD</dt>
                        <dd class="mt-1 text-3xl font-semibold text-gray-900">
                            {{ formatPrice(ticker.price) }}
                        </dd>
                    </div>
                    <div class="w-full border-t border-gray-200"></div>
                    <button
                        @click.stop="handleDelete(ticker)"
                        class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
                    >
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#718096" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd" :d="svg.checkout"></path>
						</svg>
						{{ labels.delete }}
                    </button>
                </div>
            </dl>
			<div class="flex justify-center mt-3">
				<AddButton @click="openPopUp" :icon="svg.ban" :inner-text="labels.delete_all" color-class="bg-red-600 hover:bg-red-700"/>
			</div>
            <hr class="w-full border-t border-gray-600 my-4" />
        </template>
        <ShowGraph :selected-ticker="selectedTicker" @close-graph="selectedTicker = null"/>
    </div>
	<PopUp :is-popup-show="isPopupShow" @close-popup="isPopupShow = false">
		<template #header>
			{{ labels.do_you_really_want_to_delete_everything }}?
		</template>
		<template #main>
			{{ labels.if_you_agree_then_enter }}: {{ labels.delete }}
			<input type="text" v-model="youWantDelete">
		</template>
		<template #footer>
			<AddButton @click="isPopupShow = false" :inner-text="labels.cancel"/>
			<AddButton
				@click="youWantDelete === labels.delete ? deleteAll() : null"
				:icon="svg.checkout"
				:inner-text="labels.delete"
				color-class="bg-red-600 hover:bg-red-700"
				:class="{ 'opacity-50 cursor-not-allowed': !(youWantDelete === labels.delete) }"
			/>
		</template>
	</PopUp>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker, modalSend } from './api';
import { circle, checkout, ban } from './svg-d';
import { languageLoader } from '@/language/getter';
import AddTicker from "@/components/AddTicker";
import AddButton from "@/components/AddButton";
import ShowGraph from "@/components/ShowGraph";
import PopUp from "@/components/PopUp";

export default {
    name: 'App',

    components: {
        AddTicker,
		ShowGraph,
		AddButton,
		PopUp,
    },

    data() {
        return {
            ticker: '',
            tickers: [],
            isAddedTicker: false,
			isResetTicker: false,
            selectedTicker: null,
            isHidePreloader: true,
            allCoinNames: [],
            coinsList: [],
            page: 1,
            filter: '',
			svg: {
				circle: circle,
				checkout: checkout,
				ban: ban,
			},
			labels: {},
			language: 'en',
			isPopupShow: false,
			youWantDelete: '',
        };
    },

    computed: {
        startIndex() {
            return (this.page - 1) * 6;
        },

        endIndex() {
            return this.page * 6;
        },

        filteredTickers() {
            return this.tickers.filter((ticker) => ticker.name.includes(this.filter.toUpperCase()));
        },

        paginatedTickers() {
            return this.filteredTickers.slice(this.startIndex, this.endIndex);
        },

        hasNextPage() {
            return this.filteredTickers.length > this.endIndex;
        },

        pageStateOptions() {
            return {
                filter: this.filter,
                page: this.page,
            }
        },
    },

    created: function () {
        (async () => {
            const f = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true`);
            const data = await f.json();
            this.allCoinNames = Object.keys(data.Data);
            this.isHidePreloader = false;
        })();

        const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());

        const VALID_KEYS = ['filter', 'page'];
        VALID_KEYS.forEach(key => {
            if (windowData[key]) {
                this[key] = windowData[key];
            }
        })

        const tickersData = localStorage.getItem('criptonomicon-list');

        if (tickersData) {
            this.tickers = JSON.parse(tickersData);

            this.tickers.forEach(ticker => {
                subscribeToTicker(ticker.name, (newPrice) => this.updateTicker(ticker.name, newPrice))
            })
        }
    },

	mounted() {
		this.loadLabels();
	},

    methods: {
		loadLabels() {
			languageLoader( 'app', this.language )
				.then( labels => this.labels = labels )
				.catch( err => console.log( err ) );
		},

        updateTicker(tickerName, price) {
            this.tickers
                .filter(ticker => ticker.name === tickerName)
                .forEach(ticker => ticker.price = price)
        },

        formatPrice(price) {
            if (price === '-') {
                return price;
            }

            return price > 1 ? price.toFixed(2) : price.toPrecision(3);
        },

        add(coin) {
			if(coin.length === 0) return;

            if(this.checkTicker(coin)) return;

            const currentTicker = {
                name: coin.toUpperCase(),
                price: '-'
            };

            this.tickers = [...this.tickers, currentTicker];

            subscribeToTicker(currentTicker.name, (newPrice) => this.updateTicker(currentTicker.name, newPrice))
            this.filter = '';
            this.isResetTicker = true;
        },

        checkTicker(ticker) {

            this.tickers.forEach((coin) => {
                if (coin.name === ticker.toUpperCase()) {
                    this.isAddedTicker = true;
                }
            });
            return this.isAddedTicker;
        },

        resetTicker() {
            if(this.isAddedTicker) {
                this.isAddedTicker = !this.isAddedTicker;
            }
			this.isResetTicker = false;
        },

        find(coin) {
            let regexp = new RegExp(`^${coin.toUpperCase()}`);
            this.coinsList = this.allCoinNames
				.filter((coinName) => regexp.test(coinName))
				.sort()
				.splice(0, 4);
        },

        handleDelete(tickerToRemove) {
            this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
            if(this.selectedTicker === tickerToRemove) {
                this.selectedTicker = null;
            }
            unsubscribeFromTicker(tickerToRemove.name)
        },

		deleteAll() {
			this.tickers.forEach((ticker) => {
				unsubscribeFromTicker(ticker.name);
			})
			this.tickers = [];
			this.isPopupShow = false;
			modalSend();
		},

        select(ticker) {
            this.selectedTicker = ticker;
        },

		openPopUp() {
			this.youWantDelete = '';
			this.isPopupShow = true;
		},
    },

    watch: {
        ticker() {
            this.resetTicker();
        },

        tickers() {
            localStorage.setItem('criptonomicon-list', JSON.stringify(this.tickers));
        },

        paginatedTickers() {
            if (this.paginatedTickers.length === 0 && this.page > 1) {
                this.page -= 1
            }
        },

        filter() {
            this.page = 1;
        },

        pageStateOptions(value) {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
            );
        }
    },
};
</script>

<style src="./app.css"></style>
