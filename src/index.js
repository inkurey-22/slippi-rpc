const RPC = require('discord-rpc');

const {
    Ports,
    characters,
    stages
} = require("@slippi/slippi-js");

const {
	SlpRealTime,
	SlpLiveStream,
	ConnectionStatus
} = require("@vinceau/slp-realtime");

const fs = require('fs');

const {
    exit
} = require('process');

function updatePresence(activity) {
    client.setActivity(activity);
}

const clientId = '1373370917186572428'; // Replace with your Discord application's client ID

// Only needed if you want to use RPC in a browser
RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
    rpc.setActivity({
        details: 'Playing Slippi',
        state: 'In a match',
        startTimestamp: new Date(),
        largeImageKey: 'slippi_logo', // Make sure to upload this asset in your Discord app
        largeImageText: 'Slippi',
        // smallImageKey: 'melee_icon',  // Optional
        // smallImageText: 'Melee',
        instance: false,
    });
    console.log('Discord RPC is ready!');
});

rpc.login({ clientId }).catch(console.error);
