const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Instituicao
 *   description: Endpoints para instituições de ensino
 */

/**
 * @swagger
 * /instituicoes:
 *   get:
 *     summary: Lista todas as instituições
 *     tags: [Instituicao]
 *     responses:
 *       200:
 *         description: Lista de instituições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM instituicao ORDER BY id_instituicao');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /instituicoes/{id}:
 *   get:
 *     summary: Busca uma instituição pelo ID
 *     tags: [Instituicao]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da instituição
 *     responses:
 *       200:
 *         description: Instituição encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Instituição não encontrada
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM instituicao WHERE id_instituicao = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Instituição não encontrada');
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /instituicoes:
 *   post:
 *     summary: Cria uma nova instituição
 *     tags: [Instituicao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tx_sigla
 *               - tx_descricao
 *             properties:
 *               tx_sigla:
 *                 type: string
 *                 example: "USP"
 *               tx_descricao:
 *                 type: string
 *                 example: "Universidade de São Paulo"
 *     responses:
 *       201:
 *         description: Instituição criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/', async (req, res) => {
  const { tx_sigla, tx_descricao } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO instituicao (tx_sigla, tx_descricao) VALUES ($1, $2) RETURNING *',
      [tx_sigla, tx_descricao]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /instituicoes/{id}:
 *   put:
 *     summary: Atualiza uma instituição existente
 *     tags: [Instituicao]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da instituição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tx_sigla:
 *                 type: string
 *                 example: "USP"
 *               tx_descricao:
 *                 type: string
 *                 example: "Universidade de São Paulo"
 *     responses:
 *       200:
 *         description: Instituição atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Instituição não encontrada
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tx_sigla, tx_descricao } = req.body;

  try {
    const { rowCount } = await db.query(
      'UPDATE instituicao SET tx_sigla = $1, tx_descricao = $2 WHERE id_instituicao = $3',
      [tx_sigla, tx_descricao, id]
    );

    if (rowCount === 0) {
      return res.status(404).send('Instituição não encontrada');
    }

    const { rows } = await db.query('SELECT * FROM instituicao WHERE id_instituicao = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /instituicoes/{id}:
 *   delete:
 *     summary: Remove uma instituição pelo ID
 *     tags: [Instituicao]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da instituição
 *     responses:
 *       204:
 *         description: Instituição removida com sucesso
 *       404:
 *         description: Instituição não encontrada
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await db.query('DELETE FROM instituicao WHERE id_instituicao = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).send('Instituição não encontrada');
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
