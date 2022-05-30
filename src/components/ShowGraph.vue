<template>
	<section v-if="selectedTicker" class="relative">
		<h3 class="text-lg leading-6 font-medium text-gray-900 my-8">{{ selectedTicker.name }} - USD</h3>
		<div class="flex items-end border-gray-600 border-b border-l h-64" ref="graph">
			<div
				v-for="(bar, idx) in normalizedGraph"
				:key="idx"
				:style="{ height: `${bar}%` }"
				class="bg-purple-800 border w-10 h-24"
			></div>
		</div>
		<button type="button" @click="closeGraph" class="absolute top-0 right-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xmlns:svgjs="http://svgjs.com/svgjs"
				version="1.1"
				width="30"
				height="30"
				x="0"
				y="0"
				viewBox="0 0 511.76 511.76"
				style="enable-background: new 0 0 512 512"
				xml:space="preserve"
			>
                    <g>
                        <path :d="svg.close" fill="#718096" data-original="#000000"></path>
                    </g>
                </svg>
		</button>
	</section>
</template>

<script>
import { close } from "@/svg-d";

export default {
	name: "showGraph",

	data() {
		return {
			graph: [],
			svg: {
				close: close,
			},
		}
	},

	mounted() {
		window.addEventListener('resize', this.calculateMaxGraphElements)
	},

	beforeUnmount() {
		window.removeEventListener('resize', this.calculateMaxGraphElements)
	},
	
	props: {
		selectedTicker: {
			type: [Object, null],
			required: true,
		},
	},

	emits: {
		'close-graph': value => typeof value === 'object',
	},

	computed: {
		normalizedGraph() {
			const maxValue = Math.max(...this.graph);
			const minValue = Math.min(...this.graph);

			if(maxValue === minValue) {
				return this.graph.map(() => 50)
			}

			return this.graph.map((price) => 5 + ((price - minValue) * 95) / (maxValue - minValue));
		},
	},

	methods: {
		closeGraph() {
			this.$emit('close-graph');
			this.graph = [];
		},

		updateGraph(price) {
			this.graph.push(price);
			while (this.graph.length > this.maxGraphElements) {
				this.graph.shift();
			}
		},

		calculateMaxGraphElements() {
			if(this.$refs.graph) {
				this.maxGraphElements = this.$refs.graph.clientWidth / 38;
			}
		},
	},

	watch: {
		'selectedTicker.price': function (newVal, oldVal) {
			if(newVal !== oldVal) {
				this.updateGraph(newVal);
			}
		},
		'selectedTicker.name': function () {
			this.graph = [];

			this.$nextTick().then(this.calculateMaxGraphElements)
		},
	},
}
</script>

<style scoped>

</style>