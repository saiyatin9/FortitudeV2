const express = require('express');
const basicAuth = require('express-basic-auth');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Setup
const db = new Database('contacts.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    product TEXT,
    volume TEXT,
    message TEXT NOT NULL,
    contacted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- PUBLIC API ---

// Handle contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, company, email, phone, product, volume, message } = req.body;
  
  if (!name || !company || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO contacts (name, company, email, phone, product, volume, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, company, email, phone, product, volume, message);
    res.status(201).json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- ADMIN SECURE AREA ---

// Basic Auth Middleware for Admin Routes
const adminAuth = basicAuth({
  users: { '123': '12345' },
  challenge: true,
  realm: 'Fortitude Admin'
});

// Serve admin page
app.get('/admin', adminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get all contacts
app.get('/api/admin/contacts', adminAuth, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle contacted status
app.patch('/api/admin/contacts/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const { contacted } = req.body;
  
  try {
    const stmt = db.prepare('UPDATE contacts SET contacted = ? WHERE id = ?');
    stmt.run(contacted ? 1 : 0, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact
app.delete('/api/admin/contacts/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  
  try {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export to CSV
app.get('/api/admin/export', adminAuth, (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    
    // Create CSV content
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Product', 'Volume', 'Message', 'Contacted'];
    let csvContent = headers.join(',') + '\\n';
    
    contacts.forEach(c => {
      // Escape quotes and wrap in quotes to handle commas/newlines in message
      const escapeStr = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return `"${s}"`;
      };
      
      const row = [
        c.id,
        c.created_at,
        escapeStr(c.name),
        escapeStr(c.company),
        escapeStr(c.email),
        escapeStr(c.phone),
        escapeStr(c.product),
        escapeStr(c.volume),
        escapeStr(c.message),
        c.contacted ? 'Yes' : 'No'
      ];
      csvContent += row.join(',') + '\\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fortitude_contacts.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static frontend files (must be AFTER API routes so they don't override)
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
  console.log(`Fortitude Backend running on http://localhost:${PORT}`);
});
