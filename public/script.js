  const form = document.getElementById('devisForm');
  const formView = document.getElementById('form-view');
  const audToggle = document.getElementById('audience-toggle');
  const stepLabel1 = document.getElementById('step-1-label');

  // ===== Audience toggle =====
  audToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.aud-opt');
    if (!btn) return;
    setAudience(btn.dataset.aud);
  });

  function setAudience(aud) {
    formView.dataset.audience = aud;
    audToggle.querySelectorAll('.aud-opt').forEach(b => {
      const active = b.dataset.aud === aud;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', active ? 'true' : 'false');
    });
    stepLabel1.textContent = aud === 'entreprise' ? 'Votre entreprise' : 'Votre livraison';
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

  // ===== Live validation — text fields =====
  ['societe','prenom','nom','adresse','codepostal','ville'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      if (document.getElementById(id).value.trim()) setValid(id);
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

  document.querySelectorAll('input[name="frequence"], input[name="mouture"]').forEach(el => {
    el.addEventListener('change', updateProgress);
  });

  // ===== Café cards + chips =====
  document.querySelectorAll('.cafe-card').forEach(card => {
    card.querySelectorAll('.qty-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const alreadyActive = chip.classList.contains('is-active');

        // Deselect all chips in this card
        card.querySelectorAll('.qty-chip').forEach(c => c.classList.remove('is-active'));

        if (alreadyActive) {
          // Toggle off: deselect the whole card
          card.classList.remove('is-selected');
        } else {
          // Select this chip and mark card as selected
          chip.classList.add('is-active');
          card.classList.add('is-selected');
        }

        document.getElementById('cafes-error').style.display = 'none';
        updateProgress();
      });
    });
  });

  // ===== Data collection =====
  function getCafeSelections() {
    const cafes = [];
    const quantiteParCafe = {};
    document.querySelectorAll('.cafe-card').forEach(card => {
      const activeChip = card.querySelector('.qty-chip.is-active');
      if (activeChip) {
        const cafe = card.dataset.cafe;
        cafes.push(cafe);
        quantiteParCafe[cafe] = activeChip.dataset.value;
      }
    });
    return { cafes, quantiteParCafe };
  }

  function getData() {
    const { cafes, quantiteParCafe } = getCafeSelections();
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
      cafes,
      quantiteParCafe,
      frequence: document.querySelector('input[name="frequence"]:checked')?.value || '',
      moutures: [...document.querySelectorAll('input[name="mouture"]:checked')].map(el => el.value),
      message: document.getElementById('message').value.trim()
    };
  }

  // ===== Progress + stepper =====
  function stepProgress(d) {
    const isEnt = d.audience === 'entreprise';
    const step1 = isEnt
      ? !!(d.societe && d.collaborateurs)
      : !!(d.adresse && validateCP(d.codepostal) && d.ville);
    return [
      step1,
      !!(d.prenom && d.nom && validateEmail(d.email)),
      d.cafes.length > 0,
      true
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
    } else {
      if (d.prenom || d.nom) bits.push(`<strong>${escapeHtml((d.prenom + ' ' + d.nom).trim())}</strong>`);
      if (d.ville) bits.push(escapeHtml(d.ville));
    }

    if (d.cafes.length) {
      const cafeStr = d.cafes.map(c => `${escapeHtml(c)} ${escapeHtml(d.quantiteParCafe[c])}`).join(', ');
      bits.push(cafeStr);
    }
    if (d.frequence) bits.push(`livraison ${d.frequence.toLowerCase()}`);

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
      const target = document.getElementById('section-' + step.dataset.step);
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

    const cafesErr = document.getElementById('cafes-error');
    if (d.cafes.length === 0) {
      cafesErr.style.display = 'flex';
      valid = false;
      if (!firstInvalid) firstInvalid = 'cafes-error';
    } else {
      cafesErr.style.display = 'none';
    }

    if (!valid) {
      const el = firstInvalid === 'cafes-error'
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
        societe:       isEnt ? d.societe : 'Particulier',
        prenom:        d.prenom,
        nom:           d.nom,
        email:         d.email,
        telephone:     d.tel,
        collaborateurs: isEnt ? d.collaborateurs : '',
        secteur:       d.secteur,
        adresse:       d.adresse,
        codepostal:    d.codepostal,
        ville:         d.ville,
        cafes:         d.cafes,
        quantiteParCafe: d.quantiteParCafe,
        frequence:     d.frequence,
        moutures:      d.moutures,
        message:       d.message
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

    // Build success summary
    const body = document.getElementById('summary-box-body');
    const rows = [];
    if (isEnt) {
      rows.push(['Société', escapeHtml(d.societe) + (d.secteur ? ` · <span style="color:var(--sand)">${escapeHtml(d.secteur)}</span>` : '')]);
      rows.push(['Contact', `${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}`]);
      rows.push(['Email', escapeHtml(d.email) + (d.tel ? ` · <span style="color:var(--sand)">${escapeHtml(d.tel)}</span>` : '')]);
      rows.push(['Équipe', escapeHtml(d.collaborateurs) + ' collaborateurs']);
      if (d.ville) rows.push(['Livraison', escapeHtml(d.ville)]);
    } else {
      rows.push(['Type', '<span style="color:var(--sand)">Particulier</span>']);
      rows.push(['Contact', `${escapeHtml(d.prenom)} ${escapeHtml(d.nom)}`]);
      rows.push(['Email', escapeHtml(d.email) + (d.tel ? ` · <span style="color:var(--sand)">${escapeHtml(d.tel)}</span>` : '')]);
      rows.push(['Livraison', `${escapeHtml(d.adresse)}<br><span style="color:var(--sand)">${escapeHtml(d.codepostal)} ${escapeHtml(d.ville)}</span>`]);
    }
    rows.push(['Cafés', d.cafes.map(c => `${escapeHtml(c)} · <span style="color:var(--sand)">${escapeHtml(d.quantiteParCafe[c])}</span>`).join('<br>')]);
    if (d.frequence) rows.push(['Fréquence', escapeHtml(d.frequence)]);
    if (d.moutures.length) rows.push(['Mouture', d.moutures.map(escapeHtml).join(', ')]);
    if (d.message) rows.push(['Précisions', escapeHtml(d.message)]);

    body.innerHTML = rows.map(([k, v]) =>
      `<div class="summary-row"><dt>${k}</dt><dd>${v}</dd></div>`
    ).join('');

    const hasSurDevis = d.cafes.some(cafe => d.quantiteParCafe[cafe] === 'À estimer');
    document.getElementById('success-lead').textContent = hasSurDevis
      ? 'Notre équipe étudie votre demande et reviendra vers vous sous 48 heures avec une proposition personnalisée.'
      : 'Votre devis a été généré et vous sera envoyé par email dans quelques instants. Pensez à vérifier vos spams si vous ne le recevez pas.';

    document.getElementById('form-view').style.display = 'none';
    document.getElementById('success-view').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reset / new demande
  document.getElementById('btn-new').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
    document.querySelectorAll('.cafe-card').forEach(card => {
      card.classList.remove('is-selected');
      card.querySelectorAll('.qty-chip').forEach(c => c.classList.remove('is-active'));
    });
    document.getElementById('cafes-error').style.display = 'none';
    document.getElementById('success-view').classList.remove('show');
    document.getElementById('form-view').style.display = 'block';
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Initial state
  updateProgress();
