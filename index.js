const mysql = require('mysql');
const axios = require('axios');
const express = require('express');
const port = process.env.PORT || 3000;
const date = new Date();

const app = express();

const connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'takvim',
});
connect.connect();
app.get('/', (req, res) => {
  res.status(200).sendFile('lp.html', { root: __dirname });
});

app.get('/iller', (req, res) => {
  const query_get = 'SELECT * from iller';
  connect.query(query_get, (err, data) => {
    if (err) throw err;
    res.status(200).send(data);
  });
});

app.get('/ilceler', (req, res) => {
  const query_get = 'SELECT * from ilceler';
  connect.query(query_get, (err, data) => {
    if (err) throw err;
    res.status(200).send(data);
  });
});

app.get('/ilceler/:il', (req, res) => {
  const query_get = 'SELECT ilce from ilceler WHERE il = ?';
  const il = req.params.il;

  //   üstteki eski moda kaldı bunun yerine aşağıdaki daha kullanışlı:
  //   const get_query = `SELECT ilce from ilceler WHERE il = ${con.escape(il)}`

  connect.query(query_get, [il], (err, data) => {
    if (err) throw err;
    res.status(200).send(data);
  });
});

app.get('/namaz/:id', (req, res) => {
  const id = req.params.id;

  let gun = date.getDate();
  let ay = date.getMonth();
  let yil = date.getFullYear();

  gun = '0' + gun;
  ay = '0' + ay;

  const URL = `https://www.turktakvim.com/XMLservis.php?tip=vakit&cityID=${id}&tarih=${yil}-${gun}-${ay}&format=json`;
  axios
    .get(URL)
    .then((response) => {
      //   res.write(response.data.cityinfo.cityNameTR);

      res.status(200).json(response.data.cityinfo.vakit);
      console.log(response.data.cityinfo);
    })
    .catch((err) => console.log(err));
});

app.get('/namaz-vakitleri/:il', (req, res) => {
  const il = req.params.il;
  const query_get = `SELECT id from iller WHERE il = ?`;
  connect.query(query_get, [il], (err, data) => {
    if (err) throw err;
    const id = data[0].id;

    let gun = date.getDate();
    let ay = date.getMonth();
    let yil = date.getFullYear();

    gun = '0' + gun;
    ay = '0' + ay;

    const URL = `https://www.turktakvim.com/XMLservis.php?tip=vakit&cityID=${id}&tarih=${yil}-${gun}-${ay}&format=json`;
    axios
      .get(URL)
      .then((response) => {
        res.status(200).json(response.data.cityinfo.vakit);
      })
      .catch((err) => console.log(err));
  });
});

app.get('*', (req, res) => {
  res.status(404).send('<h1>Yaptığın aramayı kontrol et...</h1>');
});

app.listen(port, () => {
  console.log(port, ' dinleniyor...');
});
