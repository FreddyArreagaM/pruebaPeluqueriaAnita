const express = require('express');
const router = express.Router();
const controller = require('../controllers/atencion.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Atenciones:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T10:00:00Z"
 *         citaId:
 *           type: integer
 *           example: 2
 *         total:
 *           type: number
 *           example: 50.0
 */

/**
 * @swagger
 * /atenciones/:
 *   get:
 *     summary: Listar atenciones
 *     tags: [Atencion]
 *     responses:
 *       200:
 *         description: Lista de atenciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Atencion'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /atenciones/:
 *   post:
 *     summary: Crear una nueva atención
 *     tags: [Atencion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               citaId:
 *                 type: integer
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Atención creada exitosamente
 */
router.post('/', controller.crear);


module.exports = router;
