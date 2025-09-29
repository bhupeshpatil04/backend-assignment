const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');
const STORAGE_DIR = path.join(__dirname, '..', 'storage');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

const uploadLeads = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'CSV file required' });
    const leads = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => leads.push(data))
      .on('end', () => {
        const fileId = uuidv4();
        fs.writeFileSync(path.join(STORAGE_DIR, `leads_${fileId}.json`), JSON.stringify(leads, null, 2));
        res.status(201).json({ file_id: fileId, count: leads.length, message: 'Leads uploaded' });
      });
};

module.exports = { uploadLeads };
