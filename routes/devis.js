import { Router } from 'express';
import crypto from 'crypto';
import { saveDevis } from '../data/storage.js';
import { generatePDF } from '../services/pdfService.js';
import { sendDevisEmails } from '../services/mailService.js';

const router = Router();

const CAFES_META = {
  'Limmu':       { region: 'Région Limmu · Éthiopie' },
  'Sidamo':      { region: 'Région Sidama · Éthiopie' },
  'Yirgacheffe': { region: 'Région Yirgacheffe · Éthiopie' },
};

// Prix TTC par quantité — TVA non applicable art. 293 B CGI (franchise en base)
const PRICING = {
  '250 g':               { pu_ttc: 14.99, qte_label: '250 g',      sur_devis: false },
  '500 g – 1 kg':        { pu_ttc: 28.00, qte_label: '500 g',      sur_devis: false },
  '1 – 3 kg':            { pu_ttc: 52.00, qte_label: '1 kg',       sur_devis: false },
  '3 – 5 kg':            { pu_ttc: 145.00, qte_label: '3 kg',      sur_devis: false },
  'À estimer':           { pu_ttc: 0,     qte_label: '',            sur_devis: true  },
  '250 g — Découverte':  { pu_ttc: 14.99, qte_label: '250 g',      sur_devis: false },
  '500 g — 1 personne':  { pu_ttc: 26.50, qte_label: '500 g',      sur_devis: false },
  '1 kg — Couple':       { pu_ttc: 49.99, qte_label: '1 kg',       sur_devis: false },
  '2 kg — Famille':      { pu_ttc: 94.99, qte_label: '2 kg',       sur_devis: false },
  'Abonnement découverte': { pu_ttc: 12.99, qte_label: '250 g/mois', sur_devis: false },
  'Coffret cadeau':      { pu_ttc: 34.99, qte_label: '1 coffret',  sur_devis: false },
};

function formatDate(d) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function computePricing(quantiteParCafe, cafes) {
  let grand_total = 0;
  let any_sur_devis = false;

  const pricing_rows = cafes.map(cafe => {
    const quantite = quantiteParCafe?.[cafe];
    const entry = PRICING[quantite];

    if (!entry || entry.sur_devis) {
      any_sur_devis = true;
      return {
        cafe,
        region:        CAFES_META[cafe]?.region || '',
        designation:   'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France',
        qte_label:     'Sur devis',
        pu_ttc_fmt:    '—',
        total_ttc_fmt: '—',
      };
    }

    grand_total += entry.pu_ttc;
    return {
      cafe,
      region:        CAFES_META[cafe]?.region || '',
      designation:   'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France',
      qte_label:     entry.qte_label,
      pu_ttc_fmt:    fmt(entry.pu_ttc),
      total_ttc_fmt: fmt(entry.pu_ttc),
    };
  });

  if (any_sur_devis) return { pricing_rows, grand_total_fmt: null, sur_devis: true };
  return { pricing_rows, grand_total_fmt: fmt(grand_total), sur_devis: false };
}

function buildQuantiteResume(quantiteParCafe, cafes) {
  return cafes.map(cafe => {
    const qte = quantiteParCafe?.[cafe];
    if (!qte) return cafe;
    const entry = PRICING[qte];
    if (entry?.sur_devis) return `${cafe} : sur mesure`;
    return `${cafe} : ${entry?.qte_label || qte}`;
  }).join(' · ');
}

router.post('/devis', async (req, res) => {
  try {
    if (!req.is('application/json')) return res.status(415).json({ error: 'Content-Type application/json requis' });

    const {
      societe, prenom, nom, email, telephone,
      collaborateurs, secteur,
      adresse, codepostal, ville,
      cafes, quantiteParCafe, frequence, moutures, message,
    } = req.body;

    const isParticulier = societe === 'Particulier';

    // Validation
    if (!prenom?.trim()) return res.status(400).json({ error: 'Champ manquant : prenom' });
    if (!nom?.trim())    return res.status(400).json({ error: 'Champ manquant : nom' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email invalide' });
    if (!Array.isArray(cafes) || cafes.length === 0) return res.status(400).json({ error: 'Champ manquant : cafes' });
    if (!quantiteParCafe || typeof quantiteParCafe !== 'object') return res.status(400).json({ error: 'Champ manquant : quantiteParCafe' });
    const missingQte = cafes.find(c => !quantiteParCafe[c]);
    if (missingQte) return res.status(400).json({ error: `Quantité manquante pour : ${missingQte}` });

    if (!isParticulier) {
      if (!societe?.trim()) return res.status(400).json({ error: 'Champ manquant : societe' });
      if (!collaborateurs?.trim()) return res.status(400).json({ error: 'Champ manquant : collaborateurs' });
    } else {
      if (!adresse?.trim()) return res.status(400).json({ error: 'Champ manquant : adresse' });
    }

    const now = new Date();
    const validite = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const id = crypto.randomUUID();

    const devis = {
      id,
      timestamp: now.toISOString(),
      devis_numero: `MB-${now.getFullYear()}-${id.slice(0, 8).toUpperCase()}`,
      date_emission: formatDate(now),
      date_validite: formatDate(validite),
      // Client
      societe:       isParticulier ? 'Particulier' : societe,
      prenom, nom, email,
      telephone:     telephone || '',
      collaborateurs: collaborateurs || '',
      secteur:       secteur || '',
      adresse:       adresse || '',
      codepostal:    codepostal || '',
      ville:         ville || '',
      // Commande
      cafes,
      quantiteParCafe,
      quantite_resume: buildQuantiteResume(quantiteParCafe, cafes),
      frequence: frequence || '',
      moutures: moutures || [],
      message: message || '',
      // Pricing
      ...computePricing(quantiteParCafe, cafes),
      is_particulier: isParticulier,
    };

    saveDevis(devis);
    res.json({ success: true, id: devis.id });

    setImmediate(async () => {
      try {
        const pdfBuffer = devis.sur_devis ? null : await generatePDF(devis);
        await sendDevisEmails(devis, pdfBuffer);
      } catch (err) {
        console.error(`Erreur background id:${devis.id} :`, err.message);
      }
    });
  } catch (err) {
    console.error('Erreur /api/devis :', err);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
});

export default router;
