const API_KEY = 'fdd37f1fb724ea104ed69a32224b4607f760f594d90d09f1d42fb935b7290871';
// 5155c07e7f292a67895b5ad6b05b8dad7aa32cb1c2135a193068b1045c174750

const tickersHandlers = new Map();

const loadTickers = () => {
    if(tickersHandlers.size === 0) {
        return;
    }

    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()]
        .join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD]))

            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? [];
                handlers.forEach(fn => fn(newPrice))
            })
        });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb))
}

setInterval(loadTickers, 50000)

window.tickers = tickersHandlers;