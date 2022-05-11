const API_KEY = 'fdd37f1fb724ea104ed69a32224b4607f760f594d90d09f1d42fb935b7290871';
// 5155c07e7f292a67895b5ad6b05b8dad7aa32cb1c2135a193068b1045c174750

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const AGGREGATE_INDEX = '5';

socket.addEventListener('message', data => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER: parameter } = JSON.parse(data.data);

    if(parameter) {
        console.log(parameter.split('~')[2]);
        // sendToWebSocket({
        //     "action": "SubAdd",
        //     "subs": [`5~CCCAGG~A5T~BTC`]
        // })
    }
    if(type !== AGGREGATE_INDEX || newPrice === undefined) {
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice))
})

function sendToWebSocket(message) {
    const stringifiesMessage = JSON.stringify(message);
    // console.log(stringifiesMessage)
    if(socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiesMessage);
        return;
    }

    socket.addEventListener('open', () => socket.send(stringifiesMessage), { once: true })
}

function subscribeToTickerOnWs(ticker, currency = 'USD') {
    sendToWebSocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}

function unSubscribeToTickerOnWs(ticker, currency = 'BTC') {
    sendToWebSocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
}

export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker);
    unSubscribeToTickerOnWs(ticker);
}