const express = require('express');
const app = express();

app.use(express.text()); // читаем текст из тела запроса

app.post('/', (req, res) => {
  console.log('Получены данные:', req.body);
  res.sendStatus(200); // отвечаем OK
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
