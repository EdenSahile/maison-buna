import styled from 'styled-components'
import theme from '../theme'
import limmuImg from '../assets/LIMMU.png'
import sidamoImg from '../assets/SIDAMO.png'
import yirgImg from '../assets/maison buna yirgacheffe.png'

const CAFES = [
  { value: 'Limmu',       name: 'Limmu',       region: 'Région Limmu · Éthiopie',        notes: 'Floral, bergamote, jasmin',   img: limmuImg  },
  { value: 'Sidamo',      name: 'Sidamo',       region: 'Région Sidama · Éthiopie',       notes: 'Fruité, pêche, agrumes',      img: sidamoImg },
  { value: 'Yirgacheffe', name: 'Yirgacheffe',  region: 'Région Yirgacheffe · Éthiopie',  notes: 'Thé, citron, fleur blanche',  img: yirgImg   },
]

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  position: relative;
  border: 1.5px solid ${({ $checked }) => $checked ? theme.brown : theme.line};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${({ $checked }) => $checked ? theme.creamSoft : theme.white};
  box-shadow: ${({ $checked }) => $checked ? `0 0 0 3px rgba(61,40,23,0.07)` : 'none'};

  &:hover {
    border-color: ${theme.sand};
  }
`

const Photo = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
`

const Info = styled.div`
  padding: 14px 16px 16px;
`

const Name = styled.div`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 18px;
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) => $checked ? theme.brown : 'rgba(255,255,255,0.8)'};
  background: ${({ $checked }) => $checked ? theme.brown : 'rgba(46,32,16,0.4)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

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

export default function CoffeeGrid({ value = [], onChange, error }) {
  const toggle = (v) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange(next)
  }

  return (
    <div>
      <Grid>
        {CAFES.map(cafe => {
          const checked = value.includes(cafe.value)
          return (
            <Card key={cafe.value} $checked={checked} onClick={() => toggle(cafe.value)}>
              <Photo src={cafe.img} alt={cafe.name} />
              <CheckBadge $checked={checked} />
              <Info>
                <Name>{cafe.name}</Name>
                <Region>{cafe.region}</Region>
                <Notes>{cafe.notes}</Notes>
              </Info>
            </Card>
          )
        })}
      </Grid>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  )
}
