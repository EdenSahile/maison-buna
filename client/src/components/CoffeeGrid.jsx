import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import theme from '../theme'
import limmuImg from '../assets/LIMMU.png'
import sidamoImg from '../assets/SIDAMO.png'
import yirgImg from '../assets/yirgacheffe.png'

const CAFES = [
  { value: 'Limmu',       name: 'Limmu',       region: 'Région Limmu · Éthiopie',        notes: 'Floral, bergamote, jasmin',   img: limmuImg  },
  { value: 'Sidamo',      name: 'Sidamo',       region: 'Région Sidama · Éthiopie',       notes: 'Fruité, pêche, agrumes',      img: sidamoImg },
  { value: 'Yirgacheffe', name: 'Yirgacheffe',  region: 'Région Yirgacheffe · Éthiopie',  notes: 'Thé, citron, fleur blanche',  img: yirgImg   },
]

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  position: relative;
  border: 1.5px solid ${({ $checked }) => $checked ? theme.brown : theme.line};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${({ $checked }) => $checked ? theme.creamSoft : theme.white};
  box-shadow: ${({ $checked }) => $checked ? `0 0 0 3px rgba(61,40,23,0.07)` : 'none'};

  &:hover {
    border-color: ${theme.sand};
  }
`

const PhotoWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 220px;

  &:hover img {
    transform: scale(1.04);
  }

  &:hover::after {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.18);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
`

const ZoomIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 2;

  ${PhotoWrapper}:hover & {
    opacity: 1;
  }

  svg {
    width: 14px;
    height: 14px;
    stroke: ${theme.brown};
  }
`

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
  cursor: zoom-in;
`

const Info = styled.div`
  padding: 16px 18px 18px;
`

const Name = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: ${theme.brown};
  margin-bottom: 3px;
`

const Region = styled.div`
  font-size: 10px;
  color: ${theme.sand};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
`

const Notes = styled.div`
  font-size: 12px;
  color: #6B5240;
  line-height: 1.5;
`

const CheckBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => $checked ? theme.brown : 'rgba(255,255,255,0.8)'};
  background: ${({ $checked }) => $checked ? theme.brown : 'rgba(46,32,16,0.4)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 3;

  &::after {
    content: '';
    width: 5px;
    height: 9px;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(45deg) ${({ $checked }) => $checked ? 'scale(1)' : 'scale(0)'};
    margin-bottom: 2px;
    transition: transform 0.2s;
  }
`

const QuantiteWrapper = styled.div`
  overflow: hidden;
  max-height: 200px;
  opacity: 1;
`

const QuantiteInner = styled.div`
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid ${theme.line};
`

const QuantiteLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: ${({ $error }) => $error ? theme.error : theme.sand};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
  transition: color 0.2s;
`

const PillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

const Pill = styled.button`
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 9px;
  border-radius: 20px;
  border: 1px solid ${({ $active }) => $active ? theme.brown : theme.line};
  background: ${({ $active }) => $active ? theme.brown : 'transparent'};
  color: ${({ $active }) => $active ? theme.white : theme.brown};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  line-height: 1.4;

  &:hover {
    border-color: ${theme.brown};
    background: ${({ $active }) => $active ? theme.brown : 'rgba(61,40,23,0.06)'};
  }
`

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.error};
  margin-top: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${theme.error};
    flex-shrink: 0;
  }
`

// — Lightbox —

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const scaleIn = keyframes`
  from { transform: scale(0.88); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`

const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(12, 8, 4, 0.90);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: ${fadeIn} 0.2s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const LightboxImg = styled.img`
  max-width: min(88vw, 680px);
  max-height: 85vh;
  object-fit: contain;
  border-radius: 14px;
  cursor: default;
  box-shadow: 0 32px 100px rgba(0, 0, 0, 0.65);
  animation: ${scaleIn} 0.22s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const LightboxCaption = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.06em;
  white-space: nowrap;
`

const LightboxClose = styled.button`
  position: absolute;
  top: 20px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`

export default function CoffeeGrid({
  value = [],
  onChange,
  quantiteParCafe = {},
  onQuantiteChange,
  quantiteOptions = [],
  error,
  errorQuantite,
}) {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const toggle = (v) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange(next)
  }

  return (
    <div>
      <Grid>
        {CAFES.map(cafe => {
          const checked = value.includes(cafe.value)
          const selectedQte = quantiteParCafe[cafe.value]
          const missingQte = checked && !selectedQte && !!errorQuantite

          return (
            <Card key={cafe.value} $checked={checked} onClick={() => toggle(cafe.value)}>
              <PhotoWrapper
                onClick={e => { e.stopPropagation(); setLightbox(cafe) }}
                title={`Voir ${cafe.name}`}
              >
                <Photo src={cafe.img} alt={cafe.name} />
                <ZoomIcon>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </ZoomIcon>
              </PhotoWrapper>
              <CheckBadge $checked={checked} />
              <Info>
                <Name>{cafe.name}</Name>
                <Region>{cafe.region}</Region>
                <Notes>{cafe.notes}</Notes>
                <QuantiteWrapper>
                  <QuantiteInner>
                    <QuantiteLabel $error={missingQte}>Quantité</QuantiteLabel>
                    <PillsRow>
                      {quantiteOptions.map(opt => (
                        <Pill
                          key={opt.value}
                          type="button"
                          $active={selectedQte === opt.value}
                          onClick={e => { e.stopPropagation(); onQuantiteChange(cafe.value, opt.value) }}
                        >
                          {opt.label}
                        </Pill>
                      ))}
                    </PillsRow>
                  </QuantiteInner>
                </QuantiteWrapper>
              </Info>
            </Card>
          )
        })}
      </Grid>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {!error && errorQuantite && <ErrorMsg>{errorQuantite}</ErrorMsg>}

      {lightbox && (
        <LightboxOverlay onClick={() => setLightbox(null)}>
          <LightboxImg
            src={lightbox.img}
            alt={lightbox.name}
            onClick={e => e.stopPropagation()}
          />
          <LightboxCaption>{lightbox.name} · {lightbox.region}</LightboxCaption>
          <LightboxClose
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
          >
            ✕
          </LightboxClose>
        </LightboxOverlay>
      )}
    </div>
  )
}
