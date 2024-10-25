# Discord Bot

![Node.js](https://img.shields.io/badge/Node.js-21.1.0-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/Discord.js-14.16.3-blue?style=for-the-badge&logo=discord)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=github)

A feature-rich Discord bot built with Node.js and Discord.js, designed to enhance your server with various commands and functionalities.

## Features

- **Weather Command**: Get the current weather for a specified location.
- **Poll Command**: Create a poll with specified options for users to vote on.
- **Reminder Command**: Set a reminder for a specified time and message.
- **Currency Converter Command**: Convert an amount from one currency to another.
- **Quote Command**: Fetch and display a random inspirational quote.
- **Trivia Command**: Ask a random trivia question and check the user's answer.
- **Music Command**: Play music from a specified URL or search term.
- **User Info Command**: Display information about a specified user.
- **Fun Commands**: 8-ball, dice roll, random duck image, and more.
- **Random Activity Command**: Suggests a random activity to do.
- **Word of the Day Command**: Get the word of the day along with its meaning.
- **Action Command**: Perform an action and mention another user.
- **Word Command**: Fetches information about a word.

## Prerequisites

- [Node.js](https://nodejs.org/) v21.0.0 or higher
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- A Discord bot token. You can create a bot and get a token from the [Discord Developer Portal](https://discord.com/developers/applications).

## Getting Started

### Clone the Repository

```sh
git clone https://github.com/yourusername/discord-bot.git
cd discord-bot
```

### Install Dependencies

```sh
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root of your project directory and add the following:

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id
```

### Running the Bot Locally

```sh
npm run start
```

### Using Docker

#### Build and Start the Container

```sh
docker-compose up -d
```

#### Stop the Container

```sh
docker-compose down
```

#### Rebuild the Container

```sh
docker-compose up -d --build
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any questions or inquiries, please contact [Fillonit](mailto:contact@fillonit.tech), or on GitHub @Fillonit.

---

Enjoy using your Discord bot! 🎉
