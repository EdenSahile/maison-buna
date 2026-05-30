export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const validateCP = (cp) => /^\d{5}$/.test(cp)

export const INITIAL_FORM_DATA = {
  societe: '', secteur: '', collaborateurs: '',
  adresse: '', codepostal: '', ville: '',
  prenom: '', nom: '', email: '', telephone: '',
  quantite: '', frequence: '', moutures: [],
  message: '',
}

export function validate(formData, audience) {
  const errors = {}
  const isEnt = audience === 'entreprise'

  if (isEnt) {
    if (!formData.societe) errors.societe = 'Veuillez renseigner le nom de votre société'
    if (!formData.collaborateurs) errors.collaborateurs = 'Veuillez sélectionner une taille d\'équipe'
  } else {
    if (!formData.adresse) errors.adresse = 'Veuillez renseigner votre adresse'
    if (!validateCP(formData.codepostal)) errors.codepostal = 'Code postal requis (5 chiffres)'
    if (!formData.ville) errors.ville = 'Veuillez renseigner votre ville'
  }

  if (!formData.prenom) errors.prenom = 'Veuillez renseigner votre prénom'
  if (!formData.nom) errors.nom = 'Veuillez renseigner votre nom'
  if (!validateEmail(formData.email)) errors.email = 'Email invalide'
  if (!formData.quantite) errors.quantite = 'Veuillez sélectionner une quantité indicative'

  return errors
}

export function computeStepProgress(formData, audience) {
  const isEnt = audience === 'entreprise'
  return [
    isEnt
      ? !!(formData.societe && formData.collaborateurs)
      : !!(formData.adresse && validateCP(formData.codepostal) && formData.ville),
    !!(formData.prenom && formData.nom && validateEmail(formData.email)),
    !!formData.quantite,
    true,
  ]
}

export function computeProgress(formData, audience) {
  const isEnt = audience === 'entreprise'
  let filled, total

  if (isEnt) {
    filled =
      (formData.societe ? 1 : 0) +
      (formData.collaborateurs ? 1 : 0) +
      (formData.prenom ? 1 : 0) +
      (formData.nom ? 1 : 0) +
      (validateEmail(formData.email) ? 1 : 0) +
      (formData.quantite ? 1 : 0) +
      (formData.frequence ? 0.5 : 0) +
      (formData.moutures.length ? 0.5 : 0) +
      (formData.secteur ? 0.3 : 0) +
      (formData.telephone ? 0.3 : 0) +
      (formData.ville ? 0.3 : 0) +
      (formData.message ? 0.6 : 0)
    total = 1+1+1+1+1+1+0.5+0.5+0.3+0.3+0.3+0.6
  } else {
    filled =
      (formData.adresse ? 1 : 0) +
      (validateCP(formData.codepostal) ? 1 : 0) +
      (formData.ville ? 1 : 0) +
      (formData.prenom ? 1 : 0) +
      (formData.nom ? 1 : 0) +
      (validateEmail(formData.email) ? 1 : 0) +
      (formData.quantite ? 1 : 0) +
      (formData.frequence ? 0.5 : 0) +
      (formData.moutures.length ? 0.5 : 0) +
      (formData.telephone ? 0.3 : 0) +
      (formData.message ? 0.6 : 0)
    total = 1+1+1+1+1+1+1+0.5+0.5+0.3+0.6
  }

  return Math.min(100, Math.round((filled / total) * 100))
}

export function buildPayload(formData, audience) {
  const isEnt = audience === 'entreprise'
  return {
    societe: isEnt ? formData.societe : 'Particulier',
    prenom: formData.prenom,
    nom: formData.nom,
    email: formData.email,
    telephone: formData.telephone,
    collaborateurs: isEnt ? formData.collaborateurs : '',
    secteur: formData.secteur,
    adresse: !isEnt ? formData.adresse : '',
    codepostal: !isEnt ? formData.codepostal : '',
    ville: formData.ville,
    quantite: formData.quantite,
    frequence: formData.frequence,
    moutures: formData.moutures,
    message: formData.message,
  }
}
