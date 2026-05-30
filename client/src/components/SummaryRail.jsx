import styled from 'styled-components'
import theme from '../theme'

const Rail = styled.div`
  margin-top: 24px;
  margin-bottom: 32px;
  background: ${theme.creamSoft};
  border: 1px solid ${theme.line};
  border-radius: 10px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  opacity: ${({ $empty }) => ($empty ? 0.6 : 1)};
`

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${theme.white};
  border: 1px solid ${theme.line};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${theme.accent};
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
`

const Text = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${theme.sandDark};
  line-height: 1.5;

  strong { color: ${theme.brown}; font-weight: 500; }
`

export default function SummaryRail({ formData, audience }) {
  const isEnt = audience === 'entreprise'
  const bits = []

  if (isEnt) {
    if (formData.societe) bits.push(<strong key="s">{formData.societe}</strong>)
    if (formData.collaborateurs) bits.push(`${formData.collaborateurs} collab.`)
    if (formData.quantite) bits.push(`${formData.quantite} / mois`)
    if (formData.frequence) bits.push(`livraison ${formData.frequence.toLowerCase()}`)
  } else {
    const name = `${formData.prenom} ${formData.nom}`.trim()
    if (name) bits.push(<strong key="n">{name}</strong>)
    if (formData.ville) bits.push(formData.ville)
    if (formData.quantite) bits.push(formData.quantite)
    if (formData.frequence) bits.push(`livraison ${formData.frequence.toLowerCase()}`)
  }

  const isEmpty = bits.length < 2

  const content = isEmpty
    ? 'Remplissez les champs ci-dessus — un récapitulatif apparaîtra ici à mesure que vous avancez.'
    : bits.reduce((acc, bit, i) => {
        if (i === 0) return [bit]
        return [...acc, ' · ', bit]
      }, [])

  return (
    <Rail $empty={isEmpty}>
      <Icon>✦</Icon>
      <Text>
        {isEmpty ? content : <>Votre demande : {content}</>}
      </Text>
    </Rail>
  )
}
