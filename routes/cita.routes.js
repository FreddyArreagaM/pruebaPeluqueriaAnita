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

/**
 * @swagger
 * /citas/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado de una cita por ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, REALIZADA, CANCELADA]
 *                 example: REALIZADA
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado actualizado correctamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id/estado', controller.actualizarEstado);

/**
 * @swagger
 * /citas/cedula/{cedula}:
 *   get:
 *     summary: Obtener citas por cédula de cliente
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *         description: Cédula del cliente
 *     responses:
 *       200:
 *         description: Lista de citas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   clienteId:
 *                     type: integer
 *                     example: 3
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-05-30T10:00:00Z
 *                   estado:
 *                     type: string
 *                     enum: [PENDIENTE, REALIZADA, CANCELADA]
 *                     example: PENDIENTE
 *                   observaciones:
 *                     type: string
 *                     example: Cliente pidió corte sencillo
 *       404:
 *         description: No se encontraron citas para la cédula especificada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/cedula/:cedula', controller.obtenerCitasPorCedula);


module.exports = router;
