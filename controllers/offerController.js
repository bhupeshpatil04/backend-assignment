const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const STORAGE_DIR = path.join(__dirname, '..', 'storage');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);

const createOffer = (req, res) => {
    const offer = req.body;
    const offerId = uuidv4();
    fs.writeFileSync(path.join(STORAGE_DIR, `offer_${offerId}.json`), JSON.stringify(offer, null, 2));
    res.status(201).json({ offer_id: offerId, message: 'Offer stored' });
};

module.exports = { createOffer };
