import { Router } from 'express';
import crypto from 'crypto';
import { saveDevis } from '../data/storage.js';
import { generatePDF } from '../services/pdfService.js';
import { sendDevisEmails } from '../services/mailService.js';

const router = Router();

const TVA = 5.5;

// Prix HT par quantité — devis indicatif (à ajuster selon tarifs réels)
const PRICING = {
  '250 g':               { pu_ht: 14.21, qte_label: '250 g',      sur_devis: false },
  '500 g – 1 kg':        { pu_ht: 25.12, qte_label: '500 g',      sur_devis: false },
  '1 – 3 kg':            { pu_ht: 47.38, qte_label: '1 kg',       sur_devis: false },
  '3 – 5 kg':            { pu_ht: 132.69, qte_label: '3 kg',      sur_devis: false },
  'À estimer':           { pu_ht: 0,     qte_label: '',            sur_devis: true  },
  '250 g — Découverte':  { pu_ht: 14.21, qte_label: '250 g',      sur_devis: false },
  '500 g — 1 personne':  { pu_ht: 25.12, qte_label: '500 g',      sur_devis: false },
  '1 kg — Couple':       { pu_ht: 47.38, qte_label: '1 kg',       sur_devis: false },
  '2 kg — Famille':      { pu_ht: 90.04, qte_label: '2 kg',       sur_devis: false },
  'Abonnement découverte': { pu_ht: 11.37, qte_label: '250 g/mois', sur_devis: false },
  'Coffret cadeau':      { pu_ht: 33.18, qte_label: '1 coffret',  sur_devis: false },
};

function formatDate(d) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function fmt(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function computePricing(quantite) {
  const entry = PRICING[quantite];
  if (!entry || entry.sur_devis) return null;
  const total_ht  = entry.pu_ht;
  const tva       = Math.round(total_ht * TVA) / 100;
  const total_ttc = total_ht + tva;
  return {
    designation: 'Café arabica de spécialité — Éthiopien grade 1, torréfié artisanalement en France',
    qte_label:   entry.qte_label,
    pu_ht_fmt:   fmt(entry.pu_ht),
    total_ht_fmt: fmt(total_ht),
    tva_taux:    TVA,
    tva_fmt:     fmt(tva),
    total_ttc_fmt: fmt(total_ttc),
  };
}

router.post('/devis', async (req, res) => {
  try {
    const {
      societe, prenom, nom, email, telephone,
      collaborateurs, secteur,
      adresse, codepostal, ville,
      quantite, frequence, moutures, message,
    } = req.body;

    const isParticulier = societe === 'Particulier';

    // Validation
    if (!prenom?.trim()) return res.status(400).json({ error: 'Champ manquant : prenom' });
    if (!nom?.trim())    return res.status(400).json({ error: 'Champ manquant : nom' });
    if (!email?.includes('@')) return res.status(400).json({ error: 'Email invalide' });
    if (!quantite?.trim()) return res.status(400).json({ error: 'Champ manquant : quantite' });

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
      // Numéro lisible
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
      quantite, frequence: frequence || '', moutures: moutures || [], message: message || '',
      // Pricing
      pricing:      computePricing(quantite),
      sur_devis:    !computePricing(quantite),
      is_particulier: isParticulier,
      tva_taux: TVA,
    };

    saveDevis(devis);

    res.json({ success: true, id: devis.id });

    setImmediate(async () => {
      try {
        const pdfBuffer = await generatePDF(devis);
        await sendDevisEmails(devis, pdfBuffer);
      } catch (err) {
        console.error('Erreur traitement arrière-plan :', err.message);
      }
    });
  } catch (err) {
    console.error('Erreur /api/devis :', err);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
});

export default router;
