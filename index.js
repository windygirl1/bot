const TelegramBot = require('node-telegram-bot-api');

const {gameOptions, againOptions} = require('./options.js');

const token = '6396736961:AAFyqaHUimF8e7A5zF0ZRp5RqgW5kcnc6CA';

const bot = new TelegramBot(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадая цифру от 0 до 9, попробуй угадать');
  const randNum = Math.floor(Math.random() * 10);
  chats[chatId] = randNum;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начать'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Угадай цифру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    
  
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp')
      return bot.sendMessage(chatId, 'Здарова');
    } 
   
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    } 
    if (text === '/game') {
     return startGame(chatId);
    }
  return bot.sendMessage(chatId, 'Я тебя не понимаю');
  })
  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId); 
    }
    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOptions);
    } else {
      return await bot.sendMessage(chatId, `Ты не угадал цифру, бот загадал ${chats[chatId]}`, againOptions);
    }
  })
}

start();