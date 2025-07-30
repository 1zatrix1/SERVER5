// server.js
const express = require('express');
const app = express();

// Разрешаем парсинг текстового тела
app.use(express.text());

// CORS‑middleware
app.use((req, res, next) => {
  // Разрешаем запросы с любых источников (или замените '*' на конкретный origin)
  res.header('Access-Control-Allow-Origin', '*');
  // Разрешённые методы
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // Разрешённые заголовки
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // Если это preflight‑запрос — отвечаем без дальнейшей обработки
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.post('/', (req, res) => {
  console.log('Получены данные:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
