const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ดึงจุดจอดทั้งหมดที่อยู่ในเส้นทาง (เรียงตามลำดับ sequence_no)
router.get('/:routeId', async (req, res) => {
    try {
        const query = `
            SELECT rb.route_id, rb.stop_id, rb.sequence_no, bs.stop_name, bs.latitude, bs.longitude
            FROM Route_BusStop rb
            JOIN BusStop bs ON rb.stop_id = bs.stop_id
            WHERE rb.route_id = ?
            ORDER BY rb.sequence_no ASC
        `;
        const [rows] = await db.query(query, [req.params.routeId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// เพิ่มจุดจอดเข้าเส้นทาง (กำหนดลำดับได้)
router.post('/', async (req, res) => {
    const { route_id, stop_id, sequence_no } = req.body;
    try {
        await db.query(
            'INSERT INTO Route_BusStop (route_id, stop_id, sequence_no) VALUES (?, ?, ?)', 
            [route_id, stop_id, sequence_no || 1]
        );
        res.json({ message: 'เพิ่มจุดจอดเข้าเส้นทางสำเร็จ' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'จุดจอดนี้อยู่ในเส้นทางนี้แล้ว' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ลบจุดจอดออกจากเส้นทาง
router.delete('/:routeId/:stopId', async (req, res) => {
    try {
        await db.query('DELETE FROM Route_BusStop WHERE route_id = ? AND stop_id = ?', 
        [req.params.routeId, req.params.stopId]);
        res.json({ message: 'ลบจุดจอดออกจากเส้นทางสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;