const API_KEY = 'fdd37f1fb724ea104ed69a32224b4607f760f594d90d09f1d42fb935b7290871';
// 5155c07e7f292a67895b5ad6b05b8dad7aa32cb1c2135a193068b1045c174750

const tickers = new Map();

export const loadTickers = tickers => fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(',')}&tsyms=USD&api_key=${API_KEY}`
).then(r => r.json()).then(rawData => Object.fromEntries(
    Object.entries(rawData).map(([key, value]) => [key, value.USD])
));

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickers.get(ticker) || [];
    tickers.set(ticker, subscribers.filter(fn => fn !== cb))
}

window.tickers = tickers;