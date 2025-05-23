const express = require('express');
const router = express.Router();
const controller = require('../controllers/cliente.controller');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para la gestión de clientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         telefono:
 *           type: string
 *           example: "0999999999"
 *         email:
 *           type: string
 *           example: "juan@example.com"
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2025-05-20T18:30:00Z"
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener la lista de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 */

router.post('/', controller.crear);

module.exports = router;
