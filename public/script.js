  const form = document.getElementById('devisForm');
  const formView = document.getElementById('form-view');
  const audToggle = document.getElementById('audience-toggle');
  const stepLabel1 = document.getElementById('step-1-label');

  // ===== Audience toggle =====
  audToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.aud-opt');
    if (!btn) return;
    const aud = btn.dataset.aud;
    setAudience(aud);
  });

  function setAudience(aud) {
    formView.dataset.audience = aud;
    audToggle.querySelectorAll('.aud-opt').forEach(b => {
      const active = b.dataset.aud === aud;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    stepLabel1.textContent = aud === 'entreprise' ? 'Votre entreprise' : 'Votre livraison';
    // Clear any "invalid" flags on now-hidden fields
    document.querySelectorAll('.field.invalid').forEach(f => {
      if (getComputedStyle(f).display === 'none') f.classList.remove('invalid');
    });
    updateProgress();
  }

  // ===== Helpers =====
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateCP = (cp) => /^\d{5}$/.test(cp);
  const setValid = (id) => document.getElementById('field-' + id)?.classList.remove('invalid');
  const setInvalid = (id) => document.getElementById('field-' + id)?.classList.add('invalid');
  const currentAud = () => formView.dataset.audience;

  // ===== Live validation =====
  ['societe','prenom','nom','adresse','codepostal','ville'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const v = document.getElementById(id).value.trim();
      if (v) setValid(id);
      updateProgress();
    });
  });

  document.getElementById('email').addEventListener('input', function() {
    if (validateEmail(this.value)) setValid('email');
    updateProgress();
  });

  ['secteur','collaborateurs','telephone','message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateProgress);
    document.getElementById(id)?.addEventListener('change', updateProgress);
  });

  document.querySelectorAll('input[name="quantite"], input[name="quantite-p"], input[name="frequence"], input[name="mouture"]').forEach(el => {
    el.addEventListener('change', () => {
      if (el.name === 'quantite') document.getElementById('quantite-error').style.display = 'none';
      if (el.name === 'quantite-p') document.getElementById('quantite-p-error').style.display = 'none';
      updateProgress();
    });
  });

  // ===== Progress + stepper =====
  function getData() {
    return {
      audience: currentAud(),
      societe: document.getElementById('societe').value.trim(),
      secteur: document.getElementById('secteur').value,
      prenom: document.getElementById('prenom').value.trim(),
      nom: document.getElementById('nom').value.trim(),
      email: document.getElementById('email').value.trim(),
      tel: document.getElementById('telephone').value.trim(),
      collaborateurs: document.getElementById('collaborateurs').value,
      adresse: document.getElementById('adresse').value.trim(),
      codepostal: document.getElementById('codepostal').value.trim(),
      ville: document.getElementById('ville').value.trim(),
      quantite: document.querySelector('input[name="quantite"]:checked')?.value || '',
      quantiteP: document.querySelector('input[name="quantite-p"]:checked')?.value || '',
      frequence: document.querySelector('input[name="frequence"]:checked')?.value || '',
      moutures: [...document.querySelectorAll('input[name="mouture"]:checked')].map(el => el.value),
      message: document.getElementById('message').value.trim()
    };
  }

  function stepProgress(d) {
    const isEnt = d.audience === 'entreprise';
    const step1 = isEnt
      ? !!(d.societe && d.collaborateurs)
      : !!(d.adresse && validateCP(d.codepostal) && d.ville);
    const step3 = isEnt ? !!d.quantite : !!d.quantiteP;
    return [
      step1,
      !!(d.prenom && d.nom && validateEmail(d.email)),
      step3,
      true /* précisions: optional */
    ];
  }

  function updateProgress() {
    const d = getData();
    const sp = stepProgress(d);

    document.querySelectorAll('.step').forEach((step, i) => {
      step.classList.remove('is-done', 'is-active');
      if (sp[i]) step.classList.add('is-done');
    });
    const nextIdx = sp.findIndex(x => !x);
    if (nextIdx >= 0) document.querySelectorAll('.step')[nextIdx]?.classList.add('is-active');

    updateSummaryRail(d);
  }

  function updateSummaryRail(d) {
    const rail = document.getElementById('summary-rail');
    const txt = document.getElementById('summary-rail-text');
    const isEnt = d.audience === 'entreprise';
    const bits = [];

    if (isEnt) {
      if (d.societe) bits.push(`<strong>${escapeHtml(d.societe)}</strong>`);
      if (d.collaborateurs) bits.push(`${escapeHtml(d.collaborateurs)} collab.`);
      if (d.quantite) bits.push(`${escapeHtml(d.quantite)} / mois`);
      if (d.frequence) bits.push(`livraison ${d.frequence.toLowerCase()}`);
    } else {
      if (d.prenom || d.nom) bits.push(`<strong>${escapeHtml((d.prenom + ' ' + d.nom).trim())}</strong>`);
      if (d.ville) bits.push(`${escapeHtml(d.ville)}`);
      if (d.quantiteP) bits.push(`${escapeHtml(d.quantiteP)}`);
      if (d.frequence) bits.push(`livraison ${d.frequence.toLowerCase()}`);
    }

    if (bits.length >= 2) {
      rail.classList.remove('is-empty');
      txt.innerHTML = `Votre demande : ${bits.join(' · ')}`;
    } else {
      rail.classList.add('is-empty');
      txt.innerHTML = `Remplissez les champs ci-dessus — un récapitulatif apparaîtra ici à mesure que vous avancez.`;
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Click stepper -> scroll to section
  document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', () => {
      const n = step.dataset.step;
      const target = document.getElementById('section-' + n);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== Submit =====
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const d = getData();
    const isEnt = d.audience === 'entreprise';
    let valid = true;
    let firstInvalid = null;

    const check = (cond, id) => {
      if (!cond) {
        setInvalid(id);
        valid = false;
        if (!firstInvalid) firstInvalid = id;
      } else setValid(id);
    };

    if (isEnt) {
      check(!!d.societe, 'societe');
      check(!!d.collaborateurs, 'collaborateurs');
    } else {
      check(!!d.adresse, 'adresse');
      check(validateCP(d.codepostal), 'codepostal');
      check(!!d.ville, 'ville');
    }
    check(!!d.prenom, 'prenom');
    check(!!d.nom, 'nom');
    check(validateEmail(d.email), 'email');

    if (isEnt) {
      const qErr = document.getElementById('quantite-error');
      if (!d.quantite) { qErr.style.display = 'flex'; valid = false; if (!firstInvalid) firstInvalid = 'quantite-error'; }
      else qErr.style.display = 'none';
    } else {
      const qErr = document.getElementById('quantite-p-error');
      if (!d.quantiteP) { qErr.style.display = 'flex'; valid = false; if (!firstInvalid) firstInvalid = 'quantite-p-error'; }
      else qErr.style.display = 'none';
    }

    if (!valid) {
      const el = (firstInvalid === 'quantite-error' || firstInvalid === 'quantite-p-error')
        ? document.getElementById('section-3')
        : document.getElementById('field-' + firstInvalid);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Envoi au serveur
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnSpan = submitBtn.querySelector('span');
    const originalLabel = submitBtnSpan.textContent;
    submitBtn.disabled = true;
    submitBtnSpan.textContent = 'Envoi en cours…';

    try {
      const payload = {
        societe: isEnt ? d.societe : 'Particulier',
        prenom: d.prenom,
        nom: d.nom,
        email: d.email,
        telephone: d.tel,
        collaborateurs: isEnt ? d.collaborateurs : '',
        secteur: d.secteur,
        ville: d.ville,
        quantite: isEnt ? d.quantite : d.quantiteP,
        frequence: d.frequence,
        moutures: d.moutures,
        message: d.message
      };

      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtnSpan.textContent = originalLabel;
      alert(err.message);
      return;
    }

    // Build summary
    const body = document.getElementById('summary-box-body');
    const rows = [];
    if (isEnt) {
      rows.push(['Société', escapeHtml(d.societe) + (d.secteur ? ` · <span style="color:var(--sand)">${escapeHtml(d.secteur)}</span>` : '')]);
      rows.push(['Contact', `${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}`]);
      rows.push(['Email', escapeHtml(d.email) + (d.tel ? ` · <span style="color:var(--sand)">${escapeHtml(d.tel)}</span>` : '')]);
      rows.push(['Équipe', escapeHtml(d.collaborateurs) + ' collaborateurs']);
      if (d.ville) rows.push(['Livraison', escapeHtml(d.ville)]);
      rows.push(['Quantité', escapeHtml(d.quantite) + ' / mois']);
    } else {
      rows.push(['Type', '<span style="color:var(--sand)">Particulier</span>']);
      rows.push(['Contact', `${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}`]);
      rows.push(['Email', escapeHtml(d.email) + (d.tel ? ` · <span style="color:var(--sand)">${escapeHtml(d.tel)}</span>` : '')]);
      rows.push(['Livraison', `${escapeHtml(d.adresse)}<br><span style="color:var(--sand)">${escapeHtml(d.codepostal)} ${escapeHtml(d.ville)}</span>`]);
      rows.push(['Commande', escapeHtml(d.quantiteP)]);
    }
    if (d.frequence) rows.push(['Fréquence', escapeHtml(d.frequence)]);
    if (d.moutures.length) rows.push(['Mouture', d.moutures.map(escapeHtml).join(', ')]);
    if (d.message) rows.push(['Précisions', escapeHtml(d.message)]);

    body.innerHTML = rows.map(([k, v]) =>
      `<div class="summary-row"><dt>${k}</dt><dd>${v}</dd></div>`
    ).join('');

    document.getElementById('form-view').style.display = 'none';
    document.getElementById('success-view').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reset / new demande
  document.getElementById('btn-new').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    document.getElementById('quantite-error').style.display = 'none';
    document.getElementById('quantite-p-error').style.display = 'none';
    document.getElementById('success-view').classList.remove('show');
    document.getElementById('form-view').style.display = 'block';
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial state
  updateProgress();
