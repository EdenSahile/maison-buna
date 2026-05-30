import styled from 'styled-components'
import theme from '../../theme'

const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols}, 1fr)`};

  @media (max-width: 640px) {
    grid-template-columns: ${({ $cols }) => $cols >= 3 ? 'repeat(2, 1fr)' : `repeat(${$cols}, 1fr)`};
  }
`

const ChoiceItem = styled.div`
  position: relative;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    padding: 16px 18px;
    border: 1px solid ${({ $checked }) => $checked ? theme.brown : theme.line};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${({ $checked }) => $checked ? theme.creamSoft : theme.white};
    box-shadow: ${({ $checked }) => $checked ? `0 0 0 3px rgba(61,40,23,0.06), 0 1px 0 ${theme.brown}` : 'none'};
    text-align: left;
    margin: 0;
    min-height: 64px;
    position: relative;

    &:hover {
      border-color: ${theme.sand};
      background: ${theme.creamSoft};
    }

    .main {
      font-size: 15px;
      font-weight: 500;
      color: ${theme.brown};
      letter-spacing: -0.1px;
    }

    .sub {
      font-size: 12px;
      color: ${theme.sand};
      font-weight: 400;
    }
  }
`

const Check = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 18px;
  height: 18px;
  border: 1px solid ${({ $checked }) => $checked ? theme.brown : theme.line};
  border-radius: ${({ $checkbox }) => $checkbox ? '4px' : '50%'};
  background: ${({ $checked }) => $checked ? theme.brown : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    ${({ $checkbox, $checked }) => $checkbox ? `
      width: 6px;
      height: 10px;
      background: transparent;
      border-right: 2px solid ${theme.white};
      border-bottom: 2px solid ${theme.white};
      transform: ${$checked ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)'};
      margin-bottom: 2px;
      transition: transform 0.2s;
    ` : `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${theme.white};
      transform: ${$checked ? 'scale(1)' : 'scale(0)'};
      transition: transform 0.2s;
    `}
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

export default function ChoiceGrid({ cols = 3, type = 'radio', name, value, onChange, options, error }) {
  const handleChange = (optValue) => {
    if (type === 'radio') {
      onChange(optValue)
    } else {
      const newValue = value.includes(optValue)
        ? value.filter(v => v !== optValue)
        : [...value, optValue]
      onChange(newValue)
    }
  }

  const isChecked = (optValue) =>
    type === 'radio' ? value === optValue : value.includes(optValue)

  return (
    <div>
      <Grid $cols={cols}>
        {options.map((opt, i) => {
          const inputId = `${name}-${i}`
          const checked = isChecked(opt.value)
          return (
            <ChoiceItem key={opt.value} $checked={checked}>
              <input
                type={type}
                name={name}
                id={inputId}
                value={opt.value}
                checked={checked}
                onChange={() => handleChange(opt.value)}
              />
              <label htmlFor={inputId}>
                <Check $checked={checked} $checkbox={type === 'checkbox'} />
                <span className="main">{opt.label}</span>
                {opt.sub && <span className="sub">{opt.sub}</span>}
              </label>
            </ChoiceItem>
          )
        })}
      </Grid>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  )
}
