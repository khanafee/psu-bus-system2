const express = require('express');
const router = express.Router();
const db = require('../config/db');

// [R]ead - ดึงข้อมูลพนักงานทั้งหมด (ไม่ดึงรหัสผ่านไปโชว์เพื่อความปลอดภัย)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT staff_id, username, name, role FROM Staff');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [C]reate - เพิ่มพนักงานใหม่
router.post('/', async (req, res) => {
    const { username, password, name, role } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Staff (username, password, name, role) VALUES (?, ?, ?, ?)', 
            [username, password, name, role || 'driver']
        );
        res.json({ id: result.insertId, username, name, role });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Username นี้มีผู้ใช้งานแล้ว' });
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แก้ไขข้อมูลพนักงาน
router.put('/:id', async (req, res) => {
    const { username, name, role } = req.body;
    // หมายเหตุ: การแก้รหัสผ่านมักจะทำแยกอีกฟังก์ชัน แต่ในนี้เราข้ามการแก้รหัสผ่านไปก่อนเพื่อความเรียบง่าย
    try {
        await db.query(
            'UPDATE Staff SET username = ?, name = ?, role = ? WHERE staff_id = ?',
            [username, name, role, req.params.id]
        );
        res.json({ message: 'อัปเดตสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบพนักงาน
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Staff WHERE staff_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;