require('./const.js');
require('dotenv').config();
const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const token = require('./token/token.js');

let telegrafBot;
let modeMenu;
let mode = MODE.LENIENT_MODE;

function init() {
    process.env.BOT_TOKEN = token.getBotToken('./api_key/api_key.txt');
    telegrafBot = new Telegraf(process.env.BOT_TOKEN);
    console.log("Building telegram bot menu")
    buildModeMenu();
}

function buildModeMenu() {
    modeMenu = new TelegrafInlineMenu(ctx => `Please select a mode for the bot complaints!(Current Mode: ${mode == MODE.LENIENT_MODE ? 'LENIENT MODE' : 'HARSH MODE'})\n\nHARSH MODE: The bot replies you with extremely harsh messages and degrade your self-esteem over time. USE WITH CAUTION!\n\nLENIENT MODE: The bot replies you in a very soft manner that is both encouraging and uplifting. This is also the default mode for the bot as we all believe in world peace.`);
    modeMenu.setCommand('mode')
    modeMenu.simpleButton('HARSH MODE', 'harshBtn', {
        doFunc: async ctx => {
            console.log('Changing to harsh mode...');
            mode = MODE.HARSH_MODE;
            return ctx.reply('Bot is now set to harsh mode!');
        },
    });
    modeMenu.simpleButton('LENIENT MODE', 'lenientBtn', {
        joinLastRow: true,
        doFunc: async ctx => {
            console.log('Changing to lenient mode...');
            mode = MODE.LENIENT_MODE;
            return ctx.reply('Bot is now set to lenient mode!')
        },
    });
}

function start() {
    telegrafBot.use(modeMenu.init());
    telegrafBot.command('complain', ctx => {
        const replyIdx = Math.floor(Math.random() * LENIENT_REPLIES.length);
        let strippedMessage = ctx.message.text.substr(ctx.message.text.indexOf(" ") + 1); 
        if (strippedMessage.startsWith('/complain')) {
            strippedMessage = '';
        }
        
        const constructedMessage = `${STANDARD_PREAMBLE.YOU_COMPLAINED + strippedMessage + "\n\n" + STANDARD_PREAMBLE.BOT_REPLY_PREAMBLE + (mode === MODE.LENIENT_MODE ? LENIENT_REPLIES[replyIdx] : HARSH_REPLIES[replyIdx])}`;
        return ctx.reply(constructedMessage);
    });
    telegrafBot.launch();
}

init();
start();