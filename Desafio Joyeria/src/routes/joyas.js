const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const { limits, page, order_by } = req.query;
    const limit = parseInt(limits) || 10;
    const offset = (parseInt(page) - 1) * limit || 0;
    const [orderBy, direction] = order_by ? order_by.split('_') : ['id', 'ASC'];

    try {
        const result = await pool.query(
            `SELECT * FROM inventario ORDER BY ${orderBy} ${direction} LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
        const joyas = result.rows;
        const hateoas = joyas.map(joya => ({
            ...joya,
            links: {
                self: `/joyas/${joya.id}`,
                category: `/joyas?categoria=${joya.categoria}`,
                metal: `/joyas?metal=${joya.metal}`,
            },
        }));

        res.json(hateoas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las joyas' });
    }
});

router.get('/filtros', async (req, res) => {
    const { precio_max, precio_min, categoria, metal } = req.query;
    
    let conditions = [];
    let values = [];
    
    if (precio_max) {
        conditions.push('precio <= $' + (conditions.length + 1));
        values.push(precio_max);
    }
    if (precio_min) {
        conditions.push('precio >= $' + (conditions.length + 1));
        values.push(precio_min);
    }
    if (categoria) {
        conditions.push('categoria = $' + (conditions.length + 1));
        values.push(categoria);
    }
    if (metal) {
        conditions.push('metal = $' + (conditions.length + 1));
        values.push(metal);
    }
    
    const query = `SELECT * FROM inventario${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar las joyas' });
    }
});

module.exports = router;

