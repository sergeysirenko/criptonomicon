const API_KEY = 'fdd37f1fb724ea104ed69a32224b4607f760f594d90d09f1d42fb935b7290871';
// 5155c07e7f292a67895b5ad6b05b8dad7aa32cb1c2135a193068b1045c174750

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const AGGREGATE_INDEX = '5';
const ERROR_INDEX = '500';
const INVALID_SUB = 'INVALID_SUB';

socket.addEventListener('message', data => {
    const { TYPE: type, MESSAGE: message, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(data.data);
    console.log(tickersHandlers.get(currency));
    if(type === ERROR_INDEX || message === INVALID_SUB) {
        console.log(currency);
    }
    if(type !== AGGREGATE_INDEX || newPrice === undefined) {
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice))
})

function sendToWebSocket(message) {
    const stringifiesMessage = JSON.stringify(message);

    if(socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiesMessage);
        return;
    }

    socket.addEventListener('open', () => socket.send(stringifiesMessage), { once: true })
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}

function unSubscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
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
    // const subscribers = tickersHandlers.get(ticker) || [];
    // tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb))
}

// const sender = new BroadcastChannel('criptonomicon-channel');
// const receiver = new BroadcastChannel('criptonomicon-channel');
//
// sender.onmessage = (senderEvent) => {
//     console.log('I send message from sender', senderEvent)
// }
//
// receiver.onmessage = (receiverEvent) => {
//     console.log('I take message from receiver', receiverEvent)
// }
//
// window.tickers = tickersHandlers;