const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const reques = require('requests');
const movieapi = 'e58e8e08'
// e58e8e08
const token = '6458923302:AAEbP5NM1SSGyHSMLDP5Hzz8B_KPNuUG8E0';
const webUrl = 'https://serene-strudel-d69a58.netlify.app';
// const webUrl = 'https://4323-194-5-60-167.ngrok-free.app';
const ownerChatID = -1002145451332;

/*
* READ FROM FRONTEND
* - NAME*
* - EMAIL*
* - PHONE*
* - DESCRIPTION
* */

const _sendDataToOwner = async (data, from) => {
    await bot.sendMessage(ownerChatID, `Заявка принята, ${data} \n От  ${from}`);
}

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === '/start') {
        await bot.sendMessage(chatId, "Здравствуйте!!! Вас приветствует компания SMIT")
        await bot.sendPhoto(chatId, 'SMIT.jpg')

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

        await bot.sendMessage(chatId, "Ознакомьтесь с политикой")

        await bot.sendDocument(chatId, "Policy.pdf")

    }

    if (msg?.web_app_data?.data) {
        try {
            if (chatId !== ownerChatID) {
                await _sendDataToOwner(msg.web_app_data.data, JSON.stringify(msg.from))
            }
            await bot.sendMessage(chatId, 'Вы успешно зарегестрировались!')

            const data = JSON.parse(msg.web_app_data.data)
            await bot.sendMessage(chatId, 'Добро пожаловать, ' + data.Name + data.LastName);

            setTimeput(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)

        } catch (e) {
            console.log(e);
        }
    }

    if (text.match(/^\/movie (.+)$/)) {
        await bot.sendMessage(chatId, 'Вы прешли в поиск фильмов!')
        // The 'msg' is the received Message from
        // user and 'match' is the result of
        // execution above on the text content

        // Getting the name of movie from the
        // message sent to bot
        var movie = text.slice(6,);

        await bot.sendMessage(chatId, 'Вы хотите просмотреть фильм ' + movie)

        try {

            async function loadMovies(searchTerm) {
                const request = `http://www.omdbapi.com/?t=${movie}&apikey=e58e8e08`
                const req = await fetch(request);
                const data = await req.json();
                const res = JSON.stringify(data, null, 2);
                const resP = JSON.parse(res)
                bot.sendMessage(chatId,
                    '_Looking for_ ' + movie + '...',
                    {parse_mode: "Markdown"})
                // bot.sendPhoto(chatId, 'resP.Poster');
                bot.sendMessage(chatId,
                    'Result:\nTitle: '
                    + resP.Title + '\nGenre: '
                    + res.Year + '\nRated: '
                    + res.Actors + '  \nReleased: '
                    + res.Released
                )
                bot.sendMessage(chatId, res);
                // bot.sendPhoto(chatId, res.Poster, {
                //     caption: 'Result:\nTitle: '
                //         + res.Title + '\nGenre: '
                //         + res.Genre + '\nRated: '
                //         + res.Rated + '  \nReleased: '
                //         + res.Released
                // })
            }

            loadMovies('spiderman');
            bot.sendMessage(chatId, 'Ошибки не было.')

        } catch (error) {
            console.error('Ошибка:', error);
            bot.sendMessage(chatId, 'Произошла непредвиденная ошибка.');
        }
    }

});


// bot.on('message', async (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
//     const match = text.match(/^\/movie (.+)$/);
//
//     if(match) {
//         await bot.sendMessage(chatId, 'Вы прешли в поиск фильмов!')
//         // The 'msg' is the received Message from
//         // user and 'match' is the result of
//         // execution above on the text content
//
//         // Getting the name of movie from the
//         // message sent to bot
//         var movie = text.slice(6,);
//
//         await bot.sendMessage(chatId, 'Вы хотите просмотреть фильм ' + movie)
//
//         try {
//
//             async function loadMovies(searchTerm){
//                 const request = `http://www.omdbapi.com/?t=${movie}&apikey=e58e8e08`
//                 const req = await fetch(request);
//                 const data = await req.json();
//                 const res = JSON.stringify(data, null, 2);
//                 const resP = JSON.parse(res)
//                 bot.sendMessage(chatId,
//                             '_Looking for_ ' + movie + '...',
//                             {parse_mode: "Markdown"})
//                 // bot.sendPhoto(chatId, 'resP.Poster');
//                 // bot.sendMessage(chatId,
//                 //             'Result:\nTitle: '
//                 //     + resP.Title + '\nGenre: '
//                 //     + res.Year + '\nRated: '
//                 //     + res.Actors + '  \nReleased: '
//                 //     + res.Released
//                 // )
//                 bot.sendMessage(chatId, res);
//                 // bot.sendPhoto(chatId, res.Poster, {
//                 //     caption: 'Result:\nTitle: '
//                 //         + res.Title + '\nGenre: '
//                 //         + res.Genre + '\nRated: '
//                 //         + res.Rated + '  \nReleased: '
//                 //         + res.Released
//                 // })
//
//                             // Sending back response from the
//                             // bot to the user
//                             // Response has many other details,
//                             // which can be used or sent as per
//                             // requirement
//             }
//             loadMovies('spiderman');
//             bot.sendMessage(chatId, 'Ошибки не было.')
//
//         } catch (error) {
//             console.error('Ошибка:', error);
//             bot.sendMessage(chatId, 'Произошла непредвиденная ошибка.');
//         }
//     }
// });

app.post('/test', async (req, res) => {
    const {data} = req.body;
    await bot.sendMessage(ownerChatID, `test: ${data}`)
    console.log(data)
    res.send('')
})

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