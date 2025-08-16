const express = require('express');
const router = express.Router();
const pool = require('../db'); // Sua configuração do pool do pg

/**
 * @swagger
 * tags:
 *   name: TipoCurso
 *   description: CRUD para Tipo de Curso
 */

/**
 * @swagger
 * /tipocurso:
 *   get:
 *     summary: Lista todos os tipos de curso
 *     tags: [TipoCurso]
 *     responses:
 *       200:
 *         description: Lista de tipos de curso
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_curso ORDER BY id_tipo_curso');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tipos de curso' });
  }
});

/**
 * @swagger
 * /tipocurso/{id}:
 *   get:
 *     summary: Busca tipo de curso por ID
 *     tags: [TipoCurso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de curso
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de curso encontrado
 *       404:
 *         description: Tipo de curso não encontrado
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tipo_curso WHERE id_tipo_curso = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de curso não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tipo de curso' });
  }
});

/**
 * @swagger
 * /tipocurso:
 *   post:
 *     summary: Cria um novo tipo de curso
 *     tags: [TipoCurso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tx_descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de curso criado
 */
router.post('/', async (req, res) => {
  const { tx_descricao } = req.body;
  if (!tx_descricao) return res.status(400).json({ error: 'tx_descricao é obrigatório' });

  try {
    const result = await pool.query(
      'INSERT INTO tipo_curso (tx_descricao) VALUES ($1) RETURNING *',
      [tx_descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tipo de curso' });
  }
});

/**
 * @swagger
 * /tipocurso/{id}:
 *   put:
 *     summary: Atualiza um tipo de curso existente
 *     tags: [TipoCurso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de curso
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tx_descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo de curso atualizado
 *       404:
 *         description: Tipo de curso não encontrado
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tx_descricao } = req.body;

  if (!tx_descricao) return res.status(400).json({ error: 'tx_descricao é obrigatório' });

  try {
    const result = await pool.query(
      'UPDATE tipo_curso SET tx_descricao = $1 WHERE id_tipo_curso = $2 RETURNING *',
      [tx_descricao, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de curso não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tipo de curso' });
  }
});

/**
 * @swagger
 * /tipocurso/{id}:
 *   delete:
 *     summary: Remove um tipo de curso pelo ID
 *     tags: [TipoCurso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de curso
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tipo de curso removido
 *       404:
 *         description: Tipo de curso não encontrado
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tipo_curso WHERE id_tipo_curso = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de curso não encontrado' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover tipo de curso' });
  }
});

module.exports = router;
