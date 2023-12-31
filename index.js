const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6458923302:AAEbP5NM1SSGyHSMLDP5Hzz8B_KPNuUG8E0';
const webUrl = 'https://serene-strudel-d69a58.netlify.app';
// const webUrl = 'https://4323-194-5-60-167.ngrok-free.app';
const ownerChatID = -1002145451332;

const _sendDataToOwner= async (data, from)=>{
    await bot.sendMessage(ownerChatID, `Заявка принята, ${data} \n От  ${from}`);
}

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webUrl}}]
                ]
            }
        })
  }

  if(msg?.web_app_data?.data) {
    try {
        if (chatId!==ownerChatID){
            await _sendDataToOwner(msg?.web_app_data?.data, JSON.stringify(msg.from))
        }
        await bot.sendMessage(chatId, 'Вы успешно зарегестрировались!')

        const data = JSON.parse(msg?.web_app_data?.data)
        await bot.sendMessage(chatId, data.user.id);
        await bot.sendMessage(chatId, 'Ваша страна:' + data?.Name);
        // await bot.sendMessage(chatId, 'Ваша улица:' + data?.street);

        setTimeput( async () => {
            await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
        }, 3000)

    } catch (e) {
        console.log(e);
    }
  }
});

// app.post('/web-', async (req, res) => {
//     const {queryId, products, totalPrice} = req.body;
//
//     try {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'Успешная покупка',
//             input_message_content: {message_text: 'Поздравляю с покупкой. вы приобрели товар на сумму ' + totalPrice}
//         })
//         return res.status(200).json({});
//     } catch (e) {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'Не удалось приобрести товар',
//             input_message_content: {message_text: 'Не удалось приобрести товар'}
//         })
//         return res.status(500).json({});
//     }
// })

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT))