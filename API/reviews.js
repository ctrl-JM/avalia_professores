// api/reviews.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { professor } = req.query; // Obtém o professor do query string
    db.query(
      'SELECT * FROM evaluations WHERE professor = ? ORDER BY created_at DESC LIMIT 5',
      [professor],
      (err, results) => {
        if (err) {
          console.error('Erro ao buscar avaliações:', err);
          return res.status(500).json({ error: 'Erro ao buscar avaliações.' });
        }
        return res.status(200).json(results);
      }
    );
  } else if (req.method === 'POST') {
    const { professor, rating, comment } = req.body;

    if (!professor || !rating || !comment) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO evaluations (professor, rating, comment) VALUES (?, ?, ?)';
    db.query(query, [professor, rating, comment], (err, result) => {
      if (err) {
        console.error('Erro ao salvar avaliação:', err);
        return res.status(500).json({ error: 'Erro ao salvar avaliação.' });
      }
      return res.status(201).json({ id: result.insertId, professor, rating, comment });
    });
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
};
