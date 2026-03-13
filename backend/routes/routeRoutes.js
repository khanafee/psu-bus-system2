const express = require('express');
const router = express.Router();
const db = require('../config/db');

// [R]ead - ดึงข้อมูลเส้นทางทั้งหมด
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Route');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [C]reate - เพิ่มเส้นทางใหม่
router.post('/', async (req, res) => {
    const { route_name, color_code } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Route (route_name, color_code) VALUES (?, ?)', 
            [route_name, color_code || '#000000']
        );
        res.json({ id: result.insertId, route_name, color_code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แก้ไขเส้นทาง
router.put('/:id', async (req, res) => {
    const { route_name, color_code } = req.body;
    try {
        await db.query(
            'UPDATE Route SET route_name = ?, color_code = ? WHERE route_id = ?',
            [route_name, color_code, req.params.id]
        );
        res.json({ message: 'อัปเดตสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบเส้นทาง
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Route WHERE route_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;