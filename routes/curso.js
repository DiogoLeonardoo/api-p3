const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Endpoints relacionados aos cursos
 */

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM curso');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cadastra um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_instituicao
 *               - id_tipo_curso
 *               - tx_descricao
 *             properties:
 *               id_instituicao:
 *                 type: integer
 *                 example: 1
 *               id_tipo_curso:
 *                 type: integer
 *                 example: 2
 *               tx_descricao:
 *                 type: string
 *                 example: Engenharia de Software
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/', async (req, res) => {
  const { id_instituicao, id_tipo_curso, tx_descricao } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO curso (id_instituicao, id_tipo_curso, tx_descricao)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_instituicao, id_tipo_curso, tx_descricao]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Remove um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso a ser removido
 *     responses:
 *       200:
 *         description: Curso removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Curso removido com sucesso
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao remover curso
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM curso WHERE id_curso = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    
    res.status(200).json({ message: 'Curso removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover curso:', err);
    res.status(500).json({ message: 'Erro ao remover curso', error: err.message });
  }
});

module.exports = router;
