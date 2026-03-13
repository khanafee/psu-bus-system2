const express = require('express');
const router = express.Router();
const db = require('../config/db');

// [R]ead - ดึงข้อมูลการแจ้งปัญหาทั้งหมด (Join เอาชื่อแอดมินมาแสดงด้วย)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT i.*, s.name AS admin_name 
            FROM IssueReport i
            LEFT JOIN Staff s ON i.staff_id = s.staff_id
            ORDER BY i.issue_id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [C]reate - เพิ่มการแจ้งปัญหาใหม่
router.post('/', async (req, res) => {
    const { issue_type, description, image_url, reporter_contact, is_masked } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO IssueReport (issue_type, description, image_url, reporter_contact, is_masked) VALUES (?, ?, ?, ?, ?)', 
            [issue_type, description, image_url || null, reporter_contact || null, is_masked || false]
        );
        res.json({ id: result.insertId, message: 'แจ้งปัญหาสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [U]pdate - แอดมินอัปเดตสถานะปัญหา
router.put('/:id', async (req, res) => {
    const { issue_type, description, image_url, reporter_contact, is_masked, status, staff_id } = req.body;
    try {
        await db.query(
            'UPDATE IssueReport SET issue_type=?, description=?, image_url=?, reporter_contact=?, is_masked=?, status=?, staff_id=? WHERE issue_id=?',
            [issue_type, description, image_url, reporter_contact, is_masked, status, staff_id || null, req.params.id]
        );
        res.json({ message: 'อัปเดตปัญหาสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [D]elete - ลบการแจ้งปัญหา
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM IssueReport WHERE issue_id = ?', [req.params.id]);
        res.json({ message: 'ลบสำเร็จ' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;