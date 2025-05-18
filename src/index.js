/**
 * Discord Rich Presence integration for Slippi (Melee replay/Netplay) using slippi-js and slp-realtime.
 * 
 * This script connects to a running Slippi Dolphin instance, listens for game events,
 * and updates Discord Rich Presence with match details in real-time.
 */

const RPC = require('discord-rpc');
const { Ports, characters, stages } = require("@slippi/slippi-js");
const { SlpRealTime, SlpLiveStream } = require("@vinceau/slp-realtime");
const { exit } = require('process');

// Timestamp for when the application started, used for Discord activity
const startTimestamp = Date.now();

// Global activity object for Discord Rich Presence
globalActivity = {
    details: 'Playing Slippi',           // Main line in Discord status
    state: 'Waiting for a match',        // Sub-line in Discord status
    largeImageKey: 'slippi_logo',        // Key for large image asset
    largeImageText: 'Slippi',            // Hover text for large image
    instance: false,                     // Discord instance flag
}

// Discord application client ID (replace with your own if needed)
const clientId = '1373370917186572428';

// Register the Discord RPC client
RPC.register(clientId);

// Create a new Discord RPC client using IPC transport
const client = new RPC.Client({ transport: 'ipc' });

// Array to track current stocks for each player
stocks = []

/**
 * Event: Discord RPC client is ready
 * Sets the initial activity and logs readiness.
 */
client.on('ready', () => {
    globalActivity.startTimestamp = startTimestamp;
    client.setActivity(globalActivity);
    console.log('Discord RPC is ready!');
});

// Log in to Discord RPC
client.login({ clientId }).catch(console.error);

// Create a new Slippi LiveStream connection to Dolphin
const livestream = new SlpLiveStream("dolphin");

// Start the Slippi LiveStream on the default port (usually 51441)
livestream
    .start("127.0.0.1", Ports.DEFAULT)
    .then(() => {
        console.log("Successfully connected!");
    })
    .catch(console.error);

// Create a new Slippi RealTime instance and bind it to the livestream
const realtime = new SlpRealTime("dolphin");
realtime.setStream(livestream);

/**
 * Converts a string to snake_case for Discord image keys.
 * Also replaces é with e for compatibility.
 * @param {string} str - The string to convert.
 * @returns {string} - The snake_case version of the string.
 */
function toSnakeCase(str) {
    return str
        .replace(/[\s']/g, '_')
        .replace(/é/g, 'e')
        .toLowerCase();
}

/**
 * Event: Game Start
 * Updates Discord Rich Presence with player and stage info when a new game starts.
 */
realtime.game.start$
    .subscribe((payload) => {
        stocks = []
        if (payload) {
            globalActivity.startTimestamp = startTimestamp;
            player1 = payload.players[0].displayName || "Unknown"
            player2 = payload.players[1].displayName || "Unknown"
            char1 = characters.getCharacterName(payload.players[0].characterId) || "Unknown"
            char2 = characters.getCharacterName(payload.players[1].characterId) || "Unknown"
            globalActivity.details = `${player1} (${char1}) vs ${player2} (${char2})`;
            globalActivity.largeImageKey = toSnakeCase(stages.getStageName(payload.stageId));
            globalActivity.largeImageText = stages.getStageName(payload.stageId);
            client.setActivity(globalActivity);
        }
    });

/**
 * Event: Game End
 * Resets Discord Rich Presence to waiting state when a game ends.
 */
realtime.game.end$
    .subscribe((payload) => {
        globalActivity = {
            details: 'Playing Slippi',
            state: 'Waiting for a match',
            largeImageKey: 'slippi_logo',
            largeImageText: 'Slippi',
            startTimestamp: startTimestamp,
        }
        client.setActivity(globalActivity);
    })    

/**
 * Event: Player Stock Change
 * Updates Discord Rich Presence with current stock counts for both players.
 */
realtime.stock.playerSpawn$.subscribe((stock) => {
    const { playerIndex, count } = stock;
    stocks[playerIndex] = count;
    const stockWord = stocks[0] <= 1 ? "stock" : "stocks";
    globalActivity.state = `${stocks[0]} ${stockWord} to ${stocks[1]}`;
    globalActivity.startTimestamp = startTimestamp;
    client.setActivity(globalActivity);
});
