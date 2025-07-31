const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// === Раздача статики ===
app.use(express.static(path.join(__dirname, 'public')));

// === Разрешение CORS ===
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// === Обработка preflight-запросов ===
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// === Парсинг JSON ===
app.use(express.json({ limit: '1mb' }));

// === Обработчик POST-запроса /collector ===
app.post('/collector', (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString();
  data._receivedAt = timestamp;

  // === Сохраняем в public/log.json ===
  const logPath = path.join(__dirname, 'public', 'log.json');

  fs.appendFile(logPath, JSON.stringify(data, null, 2) + ',\n', err => {
    if (err) {
      console.error('[S-1] Ошибка записи:', err);
      return res.status(500).send('Ошибка');
    }

    console.log('[S-1] Данные получены и сохранены.');
    res.status(204).end();
  });
});

// === Запуск сервера ===
app.listen(PORT, () => {
  console.log(`[S-1] Сервер слушает на http://localhost:${PORT}`);
});
