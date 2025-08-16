const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Disciplinas
 *   description: Endpoints relacionados a disciplinas
 */

/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Lista todas as disciplinas
 *     tags: [Disciplinas]
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM disciplina');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /disciplinas:
 *   post:
 *     summary: Cadastra uma nova disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_curso
 *               - id_tipo_disciplina
 *               - tx_sigla
 *               - tx_descricao
 *               - in_periodo
 *               - in_carga_horaria
 *             properties:
 *               id_curso:
 *                 type: integer
 *               id_tipo_disciplina:
 *                 type: integer
 *               tx_sigla:
 *                 type: string
 *               tx_descricao:
 *                 type: string
 *               in_periodo:
 *                 type: integer
 *               in_carga_horaria:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Disciplina cadastrada
 */
router.post('/', async (req, res) => {
  const { id_curso, id_tipo_disciplina, tx_sigla, tx_descricao, in_periodo, in_carga_horaria } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO disciplina (id_curso, id_tipo_disciplina, tx_sigla, tx_descricao, in_periodo, in_carga_horaria) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_curso, id_tipo_disciplina, tx_sigla, tx_descricao, in_periodo, in_carga_horaria]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /disciplinas/estatisticas/disciplinas:
 *   get:
 *     summary: Retorna a quantidade de disciplinas por curso
 *     tags: [Disciplinas]
 *     responses:
 *       200:
 *         description: Lista com a quantidade de disciplinas por curso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   curso:
 *                     type: string
 *                     description: Nome do curso
 *                   quantidade_disciplinas:
 *                     type: integer
 *                     description: Quantidade de disciplinas do curso
 *       500:
 *         description: Erro ao buscar estatísticas de disciplinas
 */

router.get('/estatisticas/disciplinas', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT c.tx_descricao AS curso, COUNT(d.id_disciplina) AS quantidade_disciplinas
      FROM curso c
      LEFT JOIN disciplina d ON c.id_curso = d.id_curso
      GROUP BY c.tx_descricao
      ORDER BY quantidade_disciplinas DESC
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar estatísticas de disciplinas:', err);
    res.status(500).send('Erro ao buscar estatísticas de disciplinas');
  }
});

/**
 * @swagger
 * /disciplinas/curso/{cursoId}:
 *   post:
 *     summary: Adiciona uma disciplina a um curso específico
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso ao qual a disciplina será vinculada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_tipo_disciplina
 *               - tx_sigla
 *               - tx_descricao
 *               - in_periodo
 *               - in_carga_horaria
 *             properties:
 *               id_tipo_disciplina:
 *                 type: integer
 *                 description: ID do tipo da disciplina
 *                 example: 1
 *               tx_sigla:
 *                 type: string
 *                 description: Sigla da disciplina
 *                 example: "POO"
 *               tx_descricao:
 *                 type: string
 *                 description: Nome completo da disciplina
 *                 example: "Programação Orientada a Objetos"
 *               in_periodo:
 *                 type: integer
 *                 description: Período em que a disciplina é ministrada
 *                 example: 3
 *               in_carga_horaria:
 *                 type: integer
 *                 description: Carga horária da disciplina em horas
 *                 example: 60
 *     responses:
 *       201:
 *         description: Disciplina adicionada ao curso com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_disciplina:
 *                   type: integer
 *                 id_curso:
 *                   type: integer
 *                 tx_descricao:
 *                   type: string
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro ao adicionar disciplina ao curso
 */
router.post('/curso/:cursoId', async (req, res) => {
  const cursoId = req.params.cursoId;
  const { 
    id_tipo_disciplina, 
    tx_sigla, 
    tx_descricao, 
    in_periodo, 
    in_carga_horaria 
  } = req.body;
  
  try {
    // Verificar se o curso existe
    const cursoCheck = await db.query('SELECT * FROM curso WHERE id_curso = $1', [cursoId]);
    
    if (cursoCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }
    
    // Adicionar disciplina ao curso
    const { rows } = await db.query(
      `INSERT INTO disciplina (
        id_curso, 
        id_tipo_disciplina, 
        tx_sigla, 
        tx_descricao, 
        in_periodo, 
        in_carga_horaria
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [cursoId, id_tipo_disciplina, tx_sigla, tx_descricao, in_periodo, in_carga_horaria]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar disciplina ao curso:', err);
    res.status(500).json({ message: 'Erro ao adicionar disciplina ao curso', error: err.message });
  }
});

module.exports = router;
