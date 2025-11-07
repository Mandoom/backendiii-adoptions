import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Autenticación y gestión de sesiones
 */


const router = Router();


/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ada
 *               last_name:
 *                 type: string
 *                 example: Lovelace
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: swordfish
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: string
 *                   description: ID del usuario creado
 *       400:
 *         description: Valores incompletos o usuario ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incomplete values
 */
router.post('/register',sessionsController.register);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión y obtiene una cookie de sesión
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: swordfish
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; se genera la cookie `coderCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incorrect password
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: User doesn't exist
 */
router.post('/login',sessionsController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Devuelve la información del usuario autenticado
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Información del usuario obtenida del JWT en la cookie `coderCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   description: Datos del usuario decodificados del token
 */
router.get('/current',sessionsController.current);

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Autenticación y gestión de sesiones de usuarios
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Ada
 *               last_name:
 *                 type: string
 *                 example: Lovelace
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: swordfish
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: string
 *                   description: ID del usuario creado
 *       400:
 *         description: Valores incompletos o usuario ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incomplete values
 */

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión y obtiene una cookie de sesión
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: swordfish
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; se genera la cookie `coderCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incorrect password
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: User doesn't exist
 */

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Devuelve la información del usuario autenticado
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Información del usuario obtenida del JWT en la cookie `coderCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   description: Datos del usuario decodificados del token
 */

/**
 * @swagger
 * /api/sessions/unprotectedLogin:
 *   get:
 *     summary: Inicia sesión sin protección y devuelve el usuario completo
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada@example.com
 *               password:
 *                 type: string
 *                 example: swordfish
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso; se genera la cookie `unprotectedCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Unprotected Logged in
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incorrect password
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: User doesn't exist
 */

/**
 * @swagger
 * /api/sessions/unprotectedCurrent:
 *   get:
 *     summary: Devuelve el documento completo del usuario autenticado sin protección
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Información completa del usuario obtenida del JWT en la cookie `unprotectedCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   description: Documento completo del usuario decodificado del token
 */

router.get('/unprotectedLogin',sessionsController.unprotectedLogin);

/**
 * @swagger
 * /api/sessions/unprotectedCurrent:
 *   get:
 *     summary: Devuelve el documento completo del usuario autenticado sin protección
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Información completa del usuario obtenida del JWT en la cookie `unprotectedCookie`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   description: Documento completo del usuario decodificado del token
 */
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);



export default router;
