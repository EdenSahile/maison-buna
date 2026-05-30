import styled from 'styled-components'
import SectionHead from './Reusable-ui/SectionHead'
import ChoiceGrid from './Reusable-ui/ChoiceGrid'

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`

const FieldBlock = styled.div`
  margin-bottom: 20px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}

  & + & { margin-top: 28px; }
`

const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #3D2817;
  margin-bottom: 8px;
  letter-spacing: 0.2px;

  span.req { color: #C8753A; margin-left: 2px; }
  span.opt { color: #9B8266; font-weight: 400; margin-left: 6px; font-size: 11px; }
`

const ENT_QUANTITE = [
  { value: '250 g', label: '250 g', sub: '14,99 €' },
  { value: '500 g – 1 kg', label: '500 g – 1 kg', sub: 'à partir de 28 €' },
  { value: '1 – 3 kg', label: '1 – 3 kg', sub: 'à partir de 52 €' },
  { value: '3 – 5 kg', label: '3 – 5 kg', sub: 'à partir de 145 €' },
  { value: 'À estimer', label: 'À estimer', sub: 'Sur devis' },
]

const PART_QUANTITE = [
  { value: '250 g — Découverte', label: '250 g', sub: '14,99 €' },
  { value: '500 g — 1 personne', label: '500 g', sub: '26,50 €' },
  { value: '1 kg — Couple', label: '1 kg', sub: '49,99 €' },
  { value: '2 kg — Famille', label: '2 kg', sub: '94,99 €' },
  { value: 'Abonnement découverte', label: 'Abonnement', sub: 'dès 12,99 €/mois' },
  { value: 'Coffret cadeau', label: 'Cadeau', sub: 'à partir de 34,99 €' },
]

const FREQUENCE = [
  { value: 'Hebdomadaire', label: 'Hebdo', sub: 'Chaque semaine' },
  { value: 'Bi-mensuelle', label: 'Bi-mensuelle', sub: 'Tous les 15 j' },
  { value: 'Mensuelle', label: 'Mensuelle', sub: 'Une fois / mois' },
  { value: 'Ponctuelle', label: 'Ponctuelle', sub: 'Événementiel' },
]

const MOUTURES = [
  { value: 'Grains entiers', label: 'Grains entiers', sub: 'À moudre soi-même' },
  { value: 'Moulu fin (espresso)', label: 'Moulu fin', sub: 'Pour espresso' },
  { value: 'Moulu moyen (filtre)', label: 'Moulu moyen', sub: 'Pour filtre' },
  { value: 'Mix selon besoin', label: 'Mix sur mesure', sub: 'Plusieurs moutures' },
]

export default function SectionCommande({ audience, formData, errors, onChange }) {
  const isEnt = audience === 'entreprise'

  return (
    <Section id="section-3" data-step="3">
      <SectionHead num="03" title="Votre commande" step="Étape 3 / 4" />

      <div id="field-quantite">
        <FieldLabel>
          Quantité {isEnt ? 'mensuelle souhaitée' : 'souhaitée'} <span className="req">*</span>
        </FieldLabel>
        <ChoiceGrid
          cols={3}
          type="radio"
          name="quantite"
          value={formData.quantite}
          onChange={v => onChange('quantite', v)}
          options={isEnt ? ENT_QUANTITE : PART_QUANTITE}
          error={errors.quantite}
        />
      </div>

      <FieldBlock style={{ marginTop: '28px' }}>
        <FieldLabel>
          {isEnt ? 'Fréquence de livraison' : 'Fréquence souhaitée'} <span className="opt">facultatif</span>
        </FieldLabel>
        <ChoiceGrid
          cols={4}
          type="radio"
          name="frequence"
          value={formData.frequence}
          onChange={v => onChange('frequence', v)}
          options={FREQUENCE}
        />
      </FieldBlock>

      <FieldBlock style={{ marginTop: '28px' }}>
        <FieldLabel>
          Mouture souhaitée <span className="opt">plusieurs choix possibles</span>
        </FieldLabel>
        <ChoiceGrid
          cols={2}
          type="checkbox"
          name="moutures"
          value={formData.moutures}
          onChange={arr => onChange('moutures', arr)}
          options={MOUTURES}
        />
      </FieldBlock>
    </Section>
  )
}
