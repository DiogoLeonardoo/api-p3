const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: Endpoints relacionados a alunos
 */

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_aluno:
 *                     type: integer
 *                   tx_nome:
 *                     type: string
 *                   tx_sexo:
 *                     type: string
 *                     enum: [M, F]
 *                   dt_nascimento:
 *                     type: string
 *                     format: date
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM aluno');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tx_nome
 *               - tx_sexo
 *               - dt_nascimento
 *             properties:
 *               tx_nome:
 *                 type: string
 *                 example: Maria Silva
 *               tx_sexo:
 *                 type: string
 *                 enum: [M, F]
 *                 example: F
 *               dt_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-15
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_aluno:
 *                   type: integer
 *                 tx_nome:
 *                   type: string
 *                 tx_sexo:
 *                   type: string
 *                 dt_nascimento:
 *                   type: string
 */
router.post('/', async (req, res) => {
  const { tx_nome, tx_sexo, dt_nascimento } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO aluno (tx_nome, tx_sexo, dt_nascimento) VALUES ($1, $2, $3) RETURNING *',
      [tx_nome, tx_sexo, dt_nascimento]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
