// let browserInstances = [];
let counter = 0;

// eslint-disable-next-line no-undef
onconnect = function(e) {
    const port = e.ports[0];

    console.log(port)

    // browserInstances.push(port);

    port.onmessage = function () {
        counter++;

        port.postMessage(`counter is ${ counter }`)

        // browserInstances.map(instance => {
        //     instance.postMessage(`counter is ${ counter }`)
        // })
    }
}