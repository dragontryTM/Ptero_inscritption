const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const axios = require('axios');
const moment = require('moment');


const commands = [
  {
    name: 'inscription',
    description: 'Créer un nouvel utilisateur',
    options: [
      {
        name: 'mot_de_passe',
        description: 'Le mot de passe pour l\'utilisateur',
        type: 3, // Type STRING
        required: true,
      },
    ],
  },
];

const clientId = 'APPLICATION_ID'; // Remplacez par l'ID de votre application
const guildId = 'YOUR_GUILD'; // Remplacez par l'ID de votre serveur

const rest = new REST({ version: '9' }).setToken('YOUR_TOKEN'); // Remplacez par votre token de bot

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });


client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'inscription') {
    const mot_de_passe = options.getString('mot_de_passe');

    const getPassword = () => {
      // Génération du mot de passe
      // (remplacez par votre propre logique si nécessaire)
      const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      let password = "";
      while (password.length < 10) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
      }
      return password;
    };

    const data = {
      "username": `${interaction.user.id}`,
      "email": `${interaction.user.id}@here.com`,
      "first_name": `${interaction.user.id}`,
      "last_name": "Utilisateur",
      "password": mot_de_passe,
      "root_admin": false,
      "language": "en"
    };

    try {
      const response = await axios.post(
        'https://URL_PANEL/api/application/users',//Remplacez URL_PANEL
        data,
        {
          headers: {
            'Authorization': 'Bearer API_PETERODACTYL', // Remplacez par votre clé d'API
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Traitez la réponse de l'API ici
      await interaction.user.send({
        content: `Voici vos informations de connexion :\nNom d'utilisateur : ${interaction.user.id}\nMot de passe : ${mot_de_passe}`
      });
      await interaction.reply({
        content: 'Utilisateur créé avec succès !',
        ephemeral: true  // Cette option rend le message privé à l'auteur
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      await interaction.reply('Une erreur est survenue lors de la création de l\'utilisateur.');
    }
  }
});

client.login('YOUR_TOKEN'); // Remplacez par votre token de bot
