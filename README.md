# Slippi Discord RPC

This project integrates Discord Rich Presence with Slippi Dolphin games, allowing users to display their current game status on Discord.

## Features

- Connects to Slippi Dolphin games to retrieve game information.
- Updates Discord status with current game details.
- Displays player names and game modes in real-time.

## Project Structure

```
slippi-discord-rpc
├── src
│   ├── index.js            # Entry point of the application
│   ├── slippi
│   │   └── slippiClient.js # Handles connection to Slippi Dolphin games
│   ├── discord
│   │   └── rpcClient.js    # Manages Discord Rich Presence
│   └── utils
│       └── helpers.js      # Utility functions for data formatting
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd slippi-discord-rpc
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

Ensure that you have the Slippi Dolphin emulator running and connected to the Slippi client for the Discord Rich Presence to update correctly.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.