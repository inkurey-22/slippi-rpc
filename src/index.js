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
const {
    exit
} = require('process');

globalActivity = {
    details: 'Playing Slippi',
    state: 'In a match',
    startTimestamp: new Date(),
    largeImageKey: 'slippi_logo', // Make sure to upload this asset in your Discord app
    largeImageText: 'Slippi',
    // smallImageKey: 'melee_icon',  // Optional
    // smallImageText: 'Melee',
}

const clientId = '1373370917186572428'; // Replace with your Discord application's client ID

// Only needed if you want to use RPC in a browser
RPC.register(clientId);

const client = new RPC.Client({ transport: 'ipc' });

stocks = []

client.on('ready', () => {
    client.setActivity({
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

client.login({ clientId }).catch(console.error);

const livestream = new SlpLiveStream("dolphin");
livestream
    .start("127.0.0.1", Ports.DEFAULT)
    .then(() => {
        console.log("Successfully connected!");
    })
    .catch(console.error);

const realtime = new SlpRealTime("dolphin");
// Read from the SlpLiveStream object from before
realtime.setStream(livestream);

function updateMeleeActivity(payload) {
    if (payload) {
        payload.players.forEach((player) => {
            console.log(`Player ${player.playerIndex + 1}: ${player.displayName || "Unknown"}`);
        })
    }
}

realtime.game.start$
    .subscribe((payload) => {
        stocks = []
        if (payload) {
            player1 = payload.players[0].displayName || "Unknown"
            player2 = payload.players[1].displayName || "Unknown"
            char1 = characters.getCharacterName(payload.players[0].characterId) || "Unknown"
            char2 = characters.getCharacterName(payload.players[1].characterId) || "Unknown"
            globalActivity.details = `${player1} (${char1}) vs ${player2} (${char2})`;
            client.setActivity(globalActivity);
        }
    });

realtime.game.end$
    .subscribe((payload) => {
        client.setActivity({
            details: 'Playing Slippi',
            state: 'In a match',
            startTimestamp: new Date(),
            largeImageKey: 'slippi_logo',
            largeImageText: 'Slippi',
            instance: false,
        });
    })    

realtime.stock.playerSpawn$.subscribe((stock) => {
  const { playerIndex, count } = stock;
  console.log(`player ${playerIndex + 1} spawned with ${count} stocks remaining`);
});
