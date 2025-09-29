const fs = require('fs');
const path = require('path');
const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const { scoreLeads } = require('../services/scoringService');

const runScoring = async (req, res) => {
    const offers = fs.readdirSync(STORAGE_DIR).filter(f => f.startsWith('offer_')).sort();
    const leadsFiles = fs.readdirSync(STORAGE_DIR).filter(f => f.startsWith('leads_')).sort();
    if (!offers.length || !leadsFiles.length) return res.status(400).json({ error: 'Offer or leads missing' });

    const offer = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, offers[offers.length -1])));
    const leads = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, leadsFiles[leadsFiles.length -1])));
    const results = await scoreLeads(offer, leads);

    const resultsId = Date.now();
    fs.writeFileSync(path.join(STORAGE_DIR, `results_${resultsId}.json`), JSON.stringify(results, null, 2));
    res.json({ results_id: resultsId, count: results.length });
};

const getResults = (req, res) => {
    const resultsFiles = fs.readdirSync(STORAGE_DIR).filter(f => f.startsWith('results_')).sort();
    if (!resultsFiles.length) return res.status(404).json({ error: 'No results found' });
    const results = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, resultsFiles[resultsFiles.length -1])));
    res.json(results);
};

const exportCSV = (req, res) => {
    const resultsFiles = fs.readdirSync(STORAGE_DIR).filter(f => f.startsWith('results_')).sort();
    if (!resultsFiles.length) return res.status(404).json({ error: 'No results found' });
    const results = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, resultsFiles[resultsFiles.length -1])));
    let csv = 'name,role,company,intent,score,reasoning\n';
    results.forEach(r => {
        csv += `${r.name},${r.role},${r.company},${r.intent},${r.score},"${r.reasoning}"\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('results.csv');
    res.send(csv);
};

module.exports = { runScoring, getResults, exportCSV };
