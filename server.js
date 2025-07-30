// server.js
const express = require('express');
const app = express();

// Парсим текст из тела
app.use(express.text());

// CORS‑middleware: ставим заголовки для всех запросов
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');           // разрешаем все источники
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Priority');
  // Если это preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Ваш старый корневой маршрут (на случай, если кто-то шлёт на /)
app.post('/', (req, res) => {
  console.log('Получены данные на /:', req.body);
  res.send('OK');
});

// Новый маршрут /collect
app.post('/collect', (req, res) => {
  console.log('Получены данные на /collect:', req.body);
  res.send('OK');
});

// Пример GET для проверки CORS
app.get('/ping', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
