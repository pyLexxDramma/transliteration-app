const express = require('express');
const bodyParser = require('body-parser');
const level = require('level');
const cors = require('cors');

const app = express();
const db = new level.Level('./db');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

// Функция транслитерации
const transliterate = (text) => {
    const translitMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    if (text && typeof text === 'string') {
        return text.split('').map(char => translitMap[char] || char).join('');
    }
    return '';
};

// Эндпоинт для транслитерации
app.post('/api', async (req, res) => {
    const { data } = req.body; // Ожидаем data
    if (!data) {
        return res.status(400).json({ error: 'data is required in body' });
    }
    const transliterated = transliterate(data);

    // Сохранение в базу данных
    await db.put(data, transliterated);

    res.json({ status: 'success', data: transliterated }); // Исправлено: возвращаем data
});

// Эндпоинт для истории
app.get('/history', async (req, res) => {
    const n = parseInt(req.query.n) || 5;
    const results = [];

    // Получение последних N записей
    for await (const [key, value] of db.iterator({ reverse: true, limit: n })) {
        results.push(value);
    }

    res.json({ results });
});

const port = 3000;

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
