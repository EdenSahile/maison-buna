import styled from 'styled-components'
import theme from '../theme'
import logoImg from '../assets/logo-amalivre.jpeg'

const Brand = styled.aside`
  background: #4F3422;
  color: ${theme.cream};
  padding: 48px 44px;
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -120px;
    bottom: -120px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(200,117,58,0.22), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    position: relative;
    height: auto;
    padding: 32px 32px 28px;
  }
`

const BrandHead = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 56px;

  @media (max-width: 1024px) { margin-bottom: 24px; }
`

const Monogram = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.35);

  img { width: 100%; height: 100%; object-fit: contain; display: block; }
`

const BrandName = styled.div`
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 5px;
  color: ${theme.cream};
  text-transform: uppercase;
  line-height: 1.4;

  small {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: #FAF6F1;
    text-transform: none;
    margin-top: 2px;
  }
`


const BrandHeadline = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 42px;
  line-height: 1.05;
  color: ${theme.white};
  margin-bottom: 24px;
  letter-spacing: -0.5px;

  em { font-style: italic; color: ${theme.accent}; }

  @media (max-width: 1024px) { font-size: 32px; margin-bottom: 12px; }
  @media (max-width: 640px) { font-size: 26px; }
`

const BrandSub = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: rgba(232, 221, 204, 0.7);
  max-width: 320px;
  margin-bottom: 48px;

  @media (max-width: 1024px) { margin-bottom: 24px; }
`

const Stepper = styled.div`
  margin-top: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { display: none; }
`

const StepperTitle = styled.div`
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.sand};
  margin-bottom: 20px;
`

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid rgba(232, 221, 204, 0.12);
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child { border-bottom: 1px solid rgba(232, 221, 204, 0.12); }
`

const StepNum = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-style: italic;
  color: ${({ $done, $active }) => $active ? theme.accent : $done ? theme.cream : theme.sand};
  width: 22px;
  transition: color 0.3s;
`

const StepLabel = styled.span`
  font-size: 13px;
  color: ${({ $done, $active }) => $active ? theme.white : $done ? 'rgba(232,221,204,0.85)' : 'rgba(232,221,204,0.6)'};
  flex: 1;
  transition: color 0.3s;
`

const StepStatus = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid ${({ $done, $active }) => ($done || $active) ? 'transparent' : 'rgba(232,221,204,0.3)'};
  background: ${({ $done, $active }) => $active ? theme.accent : $done ? theme.cream : 'transparent'};
  box-shadow: ${({ $active }) => $active ? `0 0 0 4px rgba(200,117,58,0.18)` : 'none'};
  transition: all 0.3s;
`

const STEPS = [
  { num: '01', id: 1 },
  { num: '02', label: 'Contact', id: 2 },
  { num: '03', label: 'Votre commande', id: 3 },
  { num: '04', label: 'Précisions', id: 4 },
]

export default function BrandPanel({ stepProgress, audience }) {
  const activeIdx = stepProgress.findIndex(x => !x)
  const step1Label = audience === 'entreprise' ? 'Votre entreprise' : 'Votre livraison'

  const scrollToSection = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Brand>
      <BrandHead>
        <Monogram>
          <img src={logoImg} alt="Logo Maison Buna" />
        </Monogram>
        <BrandName>
          Maison Buna
          <small>Le berceau du café</small>
        </BrandName>
      </BrandHead>

      <BrandHeadline>
        Un café <em><span style={{ color: '#FBF8F3' }}>de caractère</span></em>, chez vous ou au bureau.
      </BrandHeadline>
      <BrandSub>
        Café de spécialité éthiopien, torréfié artisanalement en France. Livraison régulière, sans engagement.
      </BrandSub>

      <Stepper>
        <StepperTitle>Votre demande</StepperTitle>
        {STEPS.map((step, i) => {
          const isDone = stepProgress[i]
          const isActive = i === activeIdx
          const label = i === 0 ? step1Label : step.label
          return (
            <Step key={step.id} onClick={() => scrollToSection(step.id)}>
              <StepNum $done={isDone} $active={isActive}>{step.num}</StepNum>
              <StepLabel $done={isDone} $active={isActive}>{label}</StepLabel>
              <StepStatus $done={isDone} $active={isActive} />
            </Step>
          )
        })}
      </Stepper>
    </Brand>
  )
}
