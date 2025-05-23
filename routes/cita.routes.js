const express = require('express');
const router = express.Router();
const controller = require('../controllers/cita.controller');

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Endpoints para la gestión de citas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         clienteId:
 *           type: integer
 *           example: 2
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2025-05-22T14:00:00Z"
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, REALIZADA, CANCELADA]
 *           example: PENDIENTE
 *         observaciones:
 *           type: string
 *           example: "Primera cita del cliente"
 */

/**
 * @swagger
 * /citas:
 *   get:
 *     summary: Obtener la lista de citas
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cita'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, REALIZADA, CANCELADA]
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 */

router.post('/', controller.crear);

module.exports = router;
