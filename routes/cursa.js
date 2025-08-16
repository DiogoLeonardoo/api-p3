const express = require('express');
const router = express.Router();
const db = require('../db');

// Registrar que um aluno está cursando uma disciplina
router.post('/', async (req, res) => {
  const {
    id_aluno,
    id_disciplina,
    in_ano,
    in_semestre,
    nm_nota1,
    nm_nota2,
    nm_nota3
  } = req.body;

  try {
    const { rows } = await db.query(`
      INSERT INTO cursa (id_aluno, id_disciplina, in_ano, in_semestre, nm_nota1, nm_nota2, nm_nota3)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [id_aluno, id_disciplina, in_ano, in_semestre, nm_nota1, nm_nota2, nm_nota3]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
