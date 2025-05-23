const express = require('express');
const router = express.Router();
const controller = require('../controllers/servicio.controller');

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para la gestión de servicios disponibles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Corte de Cabello"
 *         precio:
 *           type: number
 *           format: float
 *           example: 10.00
 *         duracion_minutos:
 *           type: integer
 *           example: 30
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Obtener la lista de servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 */
router.get('/', controller.listar);

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Lavado de Cabello"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 8.00
 *               duracion_minutos:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 */
router.post('/', controller.crear);

module.exports = router;
