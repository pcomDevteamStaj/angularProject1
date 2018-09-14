const server = require ('./server.js');

async function startup () {
    console.log ("Starting application.");

    try {
        console.log ("Initializing server module.");

        await server.initialize ();
    } catch (err) {
        console.log ("Error #01: " + err);
        process.exit (1);
    }
}

startup ();