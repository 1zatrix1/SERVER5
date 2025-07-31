const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Парсинг JSON
app.use(express.json({ limit: '1mb' }));

// Обработчик /collector
app.post('/collector', (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString();

  // Добавим временную метку
  data._receivedAt = timestamp;

  // Путь к лог-файлу
  const logPath = path.join(__dirname, 'log.json');

  // Сохраняем
  fs.appendFile(logPath, JSON.stringify(data, null, 2) + ',\n', err => {
    if (err) {
      console.error('[S-1] Ошибка записи:', err);
      return res.status(500).send('Ошибка');
    }

    console.log('[S-1] Данные получены и сохранены.');
    res.status(204).end(); // Нет содержимого
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`[S-1] Сервер слушает на http://localhost:${PORT}`);
});
