const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: Endpoints relacionados a professores
 */

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM professor');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /professores:
 *   post:
 *     summary: Cadastra um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tx_nome
 *               - id_titulo
 *               - tx_sexo
 *             properties:
 *               tx_nome:
 *                 type: string
 *               id_titulo:
 *                 type: integer
 *               tx_sexo:
 *                 type: string
 *                 enum: [M, F]
 *               tx_estado_civil:
 *                 type: string
 *                 enum: [S, C, D, V]
 *               dt_nascimento:
 *                 type: string
 *                 format: date
 *               tx_telefone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Professor cadastrado
 */
router.post('/', async (req, res) => {
  const { id_titulo, tx_nome, tx_sexo, tx_estado_civil, dt_nascimento, tx_telefone } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO professor (id_titulo, tx_nome, tx_sexo, tx_estado_civil, dt_nascimento, tx_telefone) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_titulo, tx_nome, tx_sexo, tx_estado_civil, dt_nascimento, tx_telefone]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
