const axios = require('axios');

const ruleScore = (lead, offer) => {
    let score = 0;
    const role = (lead.role || '').toLowerCase();
    const decisionKeywords = ['head','vp','director','chief','founder','ceo','cto','owner','manager','lead'];
    const influencerKeywords = ['senior','sr','principal','architect','engineer','analyst','specialist'];
    if (decisionKeywords.some(k => role.includes(k))) score += 20;
    else if (influencerKeywords.some(k => role.includes(k))) score +=10;

    const leadInd = (lead.industry || '').toLowerCase();
    const icpList = (offer.ideal_use_cases || []).map(s => s.toLowerCase());
    if (icpList.includes(leadInd)) score +=20;
    else if (icpList.some(icp => leadInd.includes(icp) || icp.includes(leadInd))) score +=10;

    const requiredFields = ['name','role','company','industry','location','linkedin_bio'];
    if (requiredFields.every(f => lead[f])) score +=10;

    return score;
};

const aiAssessIntent = async (lead, offer) => {
    if (!process.env.OPENAI_API_KEY) {
        const bio = (lead.linkedin_bio || '').toLowerCase();
        let label = 'Low';
        if (bio.includes('interested') || bio.includes('looking') || bio.includes('hiring')) label = 'High';
        else if (bio.includes('experienced') || bio.includes('familiar')) label = 'Medium';
        const mapping = { High:50, Medium:30, Low:10 };
        return { label, points: mapping[label], explanation:'Fallback heuristic used' };
    }
    const prompt = `Classify intent (High/Medium/Low) and reasoning. Offer: ${JSON.stringify(offer)}, Lead: ${JSON.stringify(lead)}`;
    try {
        const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role:'user', content: prompt }],
            max_tokens:150,
            temperature:0.0
        }, { headers: { Authorization:`Bearer ${process.env.OPENAI_API_KEY}` } });
        const reply = resp.data.choices[0].message.content.toLowerCase();
        let label = 'Low';
        if (reply.includes('high')) label='High';
        else if (reply.includes('medium')) label='Medium';
        const mapping = { High:50, Medium:30, Low:10 };
        return { label, points:mapping[label], explanation:reply };
    } catch(e) {
        return { label:'Low', points:10, explanation:'AI call failed' };
    }
};

const scoreLeads = async (offer, leads) => {
    const results = [];
    for (const lead of leads) {
        const rscore = ruleScore(lead, offer);
        const ai = await aiAssessIntent(lead, offer);
        const total = rscore + ai.points;
        results.push({
            name: lead.name,
            role: lead.role,
            company: lead.company,
            intent: ai.label,
            score: total,
            reasoning:`Rule score=${rscore}; AI: ${ai.explanation}`
        });
    }
    return results;
};

module.exports = { scoreLeads };
