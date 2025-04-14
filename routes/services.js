// routes/services.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         city:
 *           type: string
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services by city and type.
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: City name to filter services.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of service (plumber, builder, electrician).
 *     responses:
 *       200:
 *         description: A list of matching services.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Internal server error.
 */
router.get('/', (req, res) => {
  const { city, type } = req.query;
  if (!city || !type) {
    return res.status(400).json({ error: 'City and type are required' });
  }
  const pool = req.app.locals.pool;
  const query = 'SELECT * FROM services WHERE city = ? AND type = ?';
  pool.query(query, [city, type], (error, results) => {
    if (error) {
      console.error('Error querying services:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Add a new service.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', (req, res) => {
  const { name, type, city } = req.body;
  if (!name || !type || !city) {
    return res.status(400).json({ error: 'Name, type, and city are required' });
  }
  const pool = req.app.locals.pool;
  const query = 'INSERT INTO services (name, type, city) VALUES (?, ?, ?)';
  pool.query(query, [name, type, city], (error, results) => {
    if (error) {
      console.error('Error inserting service:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, name, type, city });
  });
});

module.exports = router;
