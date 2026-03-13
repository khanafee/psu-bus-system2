const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Bus');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { plate_number, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Bus (plate_number, status) VALUES (?, ?)', 
            [plate_number, status || 'active']
        );
        res.json({ id: result.insertId, plate_number, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แก้ไขข้อมูลรถบัส
router.put('/:id', async (req, res) => {
    const { plate_number, status } = req.body;
    try {
        await db.query(
            'UPDATE Bus SET plate_number = ?, status = ? WHERE bus_id = ?',
            [plate_number, status, req.params.id]
        );
        res.json({ message: 'อัปเดตสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบรถบัส
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Bus WHERE bus_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;