import { describe, it, expect } from 'vitest'
import { validate, computeStepProgress, computeProgress, buildPayload } from './formUtils'

const baseEnt = {
  societe: 'Acme', secteur: 'Tech / Startup', collaborateurs: '11 – 25',
  adresse: '', codepostal: '', ville: 'Paris',
  prenom: 'Jean', nom: 'Dupont', email: 'jean@acme.fr', telephone: '',
  quantite: '1 – 3 kg', frequence: '', moutures: [], message: '',
}

const basePart = {
  societe: '', secteur: '', collaborateurs: '',
  adresse: '12 rue de la Paix', codepostal: '75001', ville: 'Paris',
  prenom: 'Marie', nom: 'Martin', email: 'marie@email.fr', telephone: '',
  quantite: '500 g — 1 personne', frequence: '', moutures: [], message: '',
}

describe('validate', () => {
  it('retourne {} si entreprise valide', () => {
    expect(validate(baseEnt, 'entreprise')).toEqual({})
  })

  it('retourne {} si particulier valide', () => {
    expect(validate(basePart, 'particulier')).toEqual({})
  })

  it('exige societe et collaborateurs pour entreprise', () => {
    const errors = validate({ ...baseEnt, societe: '', collaborateurs: '' }, 'entreprise')
    expect(errors).toHaveProperty('societe')
    expect(errors).toHaveProperty('collaborateurs')
  })

  it('exige adresse + codepostal valide + ville pour particulier', () => {
    const errors = validate({ ...basePart, adresse: '', codepostal: '750' }, 'particulier')
    expect(errors).toHaveProperty('adresse')
    expect(errors).toHaveProperty('codepostal')
  })

  it('rejette email invalide', () => {
    expect(validate({ ...baseEnt, email: 'pasunemail' }, 'entreprise')).toHaveProperty('email')
  })

  it('exige quantite', () => {
    expect(validate({ ...baseEnt, quantite: '' }, 'entreprise')).toHaveProperty('quantite')
  })
})

describe('computeStepProgress', () => {
  it('retourne [true,true,true,true] si formulaire entreprise complet', () => {
    expect(computeStepProgress(baseEnt, 'entreprise')).toEqual([true, true, true, true])
  })

  it('step 4 est toujours true', () => {
    expect(computeStepProgress({ ...baseEnt, quantite: '' }, 'entreprise')[3]).toBe(true)
  })

  it('step 1 false si societe manquante', () => {
    expect(computeStepProgress({ ...baseEnt, societe: '' }, 'entreprise')[0]).toBe(false)
  })

  it('retourne [true,true,true,true] si formulaire particulier complet', () => {
    expect(computeStepProgress(basePart, 'particulier')).toEqual([true, true, true, true])
  })
})

describe('computeProgress', () => {
  it('retourne 0 si rien n\'est rempli', () => {
    const empty = { ...baseEnt, societe: '', collaborateurs: '', prenom: '', nom: '', email: '', quantite: '', ville: '', secteur: '' }
    expect(computeProgress(empty, 'entreprise')).toBe(0)
  })

  it('retourne 100 si tout est rempli', () => {
    const full = { ...baseEnt, frequence: 'Mensuelle', moutures: ['Grains entiers'], telephone: '0600000000', message: 'Hello' }
    expect(computeProgress(full, 'entreprise')).toBe(100)
  })
})

describe('buildPayload', () => {
  it('met societe = "Particulier" pour audience particulier', () => {
    expect(buildPayload(basePart, 'particulier').societe).toBe('Particulier')
  })

  it('inclut adresse et codepostal pour particulier', () => {
    const p = buildPayload(basePart, 'particulier')
    expect(p.adresse).toBe('12 rue de la Paix')
    expect(p.codepostal).toBe('75001')
  })

  it('laisse adresse vide pour entreprise', () => {
    expect(buildPayload(baseEnt, 'entreprise').adresse).toBe('')
  })
})
