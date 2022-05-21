<template>
    <div
        v-if="isHidePreloader"
        class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
        <svg
            class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    </div>
    <div class="container">

        <AddTicker
            @add-ticker="add"
            @find-ticker="find"
            @reset-ticker="resetTicker"
            :coins-list="coinsList"
            :is-added-ticker="isAddedTicker"
        />

        <template v-if="tickers.length">
            <hr class="w-full border-t border-gray-600 my-4" />
            <div>
                <div v-if="tickers.length > 6">
                    <p>Страница {{ page }} из {{ Math.ceil(tickers.length / 6) }}</p>
                    <button
                        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        :disabled="!(page > 1)"
                        :class="{ 'opacity-50 cursor-not-allowed': !(page > 1) }"
                        @click="page -= 1"
                    >
                        Назад
                    </button>
                    <button
                        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        @click="page = Number(page) + 1"
                        :disabled="!hasNextPage"
                        :class="{ 'opacity-50 cursor-not-allowed': !hasNextPage }"
                    >
                        Вперед
                    </button>
                </div>
                <div>Фильтр: <input v-model="filter" class="border rounded-md"/></div>
            </div>
            <hr class="w-full border-t border-gray-600 my-4" />
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div
                    v-for="ticker in paginatedTickers"
                    :key="ticker.name"
                    @click="select(ticker)"
                    :class="{
                        'border-4': selectedTicker === ticker
                    }"
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
                        <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="#718096"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            ></path></svg
                        >Удалить
                    </button>
                </div>
            </dl>
            <hr class="w-full border-t border-gray-600 my-4" />
        </template>
        <ShowGraph :selected-ticker="selectedTicker" @close-graph="selectedTicker = null"/>
    </div>
</template>

<script>
import {subscribeToTicker, unsubscribeFromTicker} from './api';
import AddTicker from "@/components/AddTicker";
import ShowGraph from "@/components/ShowGraph";

export default {
    name: 'App',

    components: {
        AddTicker,
		ShowGraph,
    },

    data() {
        return {
            ticker: '',
            tickers: [],
            isAddedTicker: false,
            selectedTicker: null,
            isHidePreloader: true,
            allCoinNames: [],
            coinsList: [],
            page: 1,
            filter: '',
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

    methods: {
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
        },

        find(coin) {
            let regexp = new RegExp(`^${coin.toUpperCase()}`);
            const coinsList = this.allCoinNames.filter((coinName) => regexp.test(coinName));
            this.coinsList = coinsList.sort().splice(0, 4);
        },

        handleDelete(tickerToRemove) {
            this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
            if(this.selectedTicker === tickerToRemove) {
                this.selectedTicker = null;
            }
            unsubscribeFromTicker(tickerToRemove.name)
        },

        select(ticker) {
            this.selectedTicker = ticker;
        }
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
    }
};
</script>

<style src="./app.css"></style>
