const express = require('express');
const router = express.Router();
const db = require('../config/db');

// [R]ead - ดึงจุดจอดทั้งหมด
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM BusStop');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [C]reate - เพิ่มจุดจอดใหม่
router.post('/', async (req, res) => {
    const { stop_name, latitude, longitude } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO BusStop (stop_name, latitude, longitude) VALUES (?, ?, ?)', 
            [stop_name, latitude || null, longitude || null]
        );
        res.json({ id: result.insertId, stop_name, latitude, longitude });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แก้ไขจุดจอด
router.put('/:id', async (req, res) => {
    const { stop_name, latitude, longitude } = req.body;
    try {
        await db.query(
            'UPDATE BusStop SET stop_name = ?, latitude = ?, longitude = ? WHERE stop_id = ?',
            [stop_name, latitude, longitude, req.params.id]
        );
        res.json({ message: 'อัปเดตสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบจุดจอด
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM BusStop WHERE stop_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;