const express = require('express');
const router = express.Router();
const db = require('../config/db');

// [R]ead - ดึงตารางเดินรถ (Join กับตารางอื่นเพื่อเอาชื่อมาแสดงแทน ID)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.schedule_id, s.start_time, s.status, 
                   s.bus_id, s.route_id, s.staff_id,
                   b.plate_number, r.route_name, st.name AS driver_name
            FROM Schedule s
            LEFT JOIN Bus b ON s.bus_id = b.bus_id
            LEFT JOIN Route r ON s.route_id = r.route_id
            LEFT JOIN Staff st ON s.staff_id = st.staff_id
            ORDER BY s.start_time ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [C]reate - สร้างตารางเดินรถใหม่
router.post('/', async (req, res) => {
    const { bus_id, route_id, staff_id, start_time, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Schedule (bus_id, route_id, staff_id, start_time, status) VALUES (?, ?, ?, ?, ?)', 
            [bus_id || null, route_id || null, staff_id || null, start_time, status || 'scheduled']
        );
        res.json({ id: result.insertId, message: 'เพิ่มตารางเดินรถสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แก้ไขตารางเดินรถ
router.put('/:id', async (req, res) => {
    const { bus_id, route_id, staff_id, start_time, status } = req.body;
    try {
        await db.query(
            'UPDATE Schedule SET bus_id = ?, route_id = ?, staff_id = ?, start_time = ?, status = ? WHERE schedule_id = ?',
            [bus_id || null, route_id || null, staff_id || null, start_time, status, req.params.id]
        );
        res.json({ message: 'อัปเดตสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบตารางเดินรถ
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Schedule WHERE schedule_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;