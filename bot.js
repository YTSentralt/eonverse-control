require('dotenv').config(); // Load environment variables from .env fileconst Discord = require('discord.js');
const mysql = require('mysql');

// Database connection details
const dbConnection = mysql.createConnection({
    host: '***.clever-cloud.com',
    user: '***',
    password: '***',
    database: '***'
});

// Create a new Discord client
const client = new Discord.Client();

// Ready event
client.once('ready', () => {
    console.log('Bot is online!');
});

// Message event
client.on('message', message => {
    if (message.content.startsWith('/')) {
        handleCommand(message);
    }
});

// Function to handle commands
function handleCommand(message) {
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'verify') {
        const minecraftUsername = args[0];
        if (!minecraftUsername) {
            message.channel.send('Please provide your Minecraft username.');
            return;
        }
        linkDiscordAndMinecraft(message.author.username, minecraftUsername);
    } else if (command === 'discord') {
        const subCommand = args.shift().toLowerCase();
        if (subCommand === 'link') {
            const discordUsername = args.join(' ');
            if (!discordUsername) {
                message.channel.send('Please provide your Discord username.');
                return;
            }
            linkDiscordAndMinecraft(discordUsername, message.author.username);
        }
    } else {
        message.channel.send('Unknown command.');
    }
}

// Function to link Discord and Minecraft accounts
function linkDiscordAndMinecraft(discordUsername, minecraftUsername) {
    const sql = 'INSERT INTO discord_users (discord_username, minecraft_username) VALUES (?, ?)';
    dbConnection.query(sql, [discordUsername, minecraftUsername], (err, result) => {
        if (err) {
            console.error('Error linking Discord and Minecraft accounts:', err);
            return;
        }
        console.log('Discord and Minecraft accounts linked successfully.');
    });
}

// Login to Discord using the bot token from environment variable
client.login(process.env.BOT_TOKEN);
