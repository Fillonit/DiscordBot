const { SlashCommandBuilder } = require('discord.js');

const puns = [
    "I used to be a baker, but I couldn't make enough dough.",
    "I'm reading a book on anti-gravity. It's impossible to put down.",
    "Did you hear about the claustrophobic astronaut? He just needed a little space.",
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta.",
    "I would avoid the sushi if I was you. It’s a little fishy.",
    "Want to hear a joke about construction? I'm still working on it.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "Why don't some couples go to the gym? Because some relationships don't work out.",
    "I used to play piano by ear, but now I use my hands.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What do you call cheese that isn't yours? Nacho cheese.",
    "I'm on a seafood diet. I see food and I eat it.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "What do you call a factory that makes good products? A satisfactory.",
    "Why did the math book look sad? Because it had too many problems.",
    "Why was the math lecture so long? The teacher kept going off on a tangent.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you call a bear with no teeth? A gummy bear.",
    "Why don't programmers like nature? It has too many bugs.",
    "Why did the coffee file a police report? It got mugged.",
    "How does a penguin build its house? Igloos it together.",
    "Why don't eggs tell jokes? They'd crack each other up.",
    "What do you call a snowman with a six-pack? An abdominal snowman.",
    "Why did the computer go to the doctor? Because it had a virus.",
    "Why did the chicken join a band? Because it had the drumsticks.",
    "Why don't some fish play piano? Because you can't tuna fish.",
    "Why did the scarecrow become a successful neurosurgeon? He was outstanding in his field.",
    "Why did the banana go to the doctor? Because it wasn't peeling well.",
    "Why did the grape stop in the middle of the road? Because it ran out of juice.",
    "Why did the cookie go to the doctor? Because it felt crummy.",
    "Why did the man put his money in the blender? He wanted to make some liquid assets.",
    "Why did the stadium get hot after the game? All the fans left.",
    "Why did the man run around his bed? To catch up on his sleep.",
    "Why did the man put his car in the oven? He wanted a hot rod.",
    "Why did the man put his money in the freezer? He wanted cold hard cash.",
    "Why did the man put his clock in the blender? He wanted to make time fly.",
    "Why did the man put his car in the washing machine? He wanted a clean getaway.",
    "Why did the man put his computer in the blender? He wanted to make a byte.",
    "Why did the man put his phone in the blender? He wanted to make a call.",
    "Why did the man put his watch in the blender? He wanted to make time fly.",
    "Why did the man put his shoes in the blender? He wanted to make a run.",
    "Why did the man put his hat in the blender? He wanted to make a cap.",
    "Why did the man put his glasses in the blender? He wanted to make a spectacle.",
    "Why did the man put his socks in the blender? He wanted to make a pair.",
    "Why did the man put his pants in the blender? He wanted to make a pair of shorts.",
    "Why did the man put his shirt in the blender? He wanted to make a top.",
    "Why did the man put his tie in the blender? He wanted to make a knot.",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pun')
        .setDescription('Get a random pun.'),
    async execute(interaction) {
        const randomPun = puns[Math.floor(Math.random() * puns.length)];
        await interaction.reply(randomPun);
    },
};