import styled, { css } from 'styled-components'
import theme from '../../theme'

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
`

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.brown};
  margin-bottom: 8px;
  letter-spacing: 0.2px;
`

const Req = styled.span`
  color: ${theme.accent};
  margin-left: 2px;
`

const Opt = styled.span`
  color: ${theme.sand};
  font-weight: 400;
  margin-left: 6px;
  font-size: 11px;
`

const baseInputStyles = css`
  width: 100%;
  background: ${({ $invalid }) => $invalid ? '#FCF3F1' : theme.white};
  border: 1px solid ${({ $invalid }) => $invalid ? theme.error : theme.line};
  border-radius: 6px;
  padding: 14px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  color: ${theme.dark};
  outline: none;
  transition: all 0.2s ease;
  appearance: none;

  &::placeholder { color: #B8AB97; }
  &:hover { border-color: ${theme.cream}; background: ${theme.creamSoft}; }
  &:focus {
    border-color: ${theme.brown};
    background: ${theme.white};
    box-shadow: 0 0 0 4px rgba(61,40,23,0.07);
  }
`

export const StyledInput = styled.input`
  ${baseInputStyles}
`

export const StyledSelect = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%239B8266' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
`

export const StyledTextarea = styled.textarea`
  ${baseInputStyles}
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
  font-family: 'Montserrat', sans-serif;
`

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.error};
  margin-top: 6px;

  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${theme.error};
    flex-shrink: 0;
  }
`

const Hint = styled.div`
  font-size: 12px;
  color: ${theme.sand};
  margin-top: 8px;
`

export default function Field({ id, label, required, optional, error, hint, full, children }) {
  return (
    <Wrapper id={id ? `field-${id}` : undefined} $full={full}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <Req>*</Req>}
          {optional && <Opt>facultatif</Opt>}
        </Label>
      )}
      {children}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {hint && <Hint>{hint}</Hint>}
    </Wrapper>
  )
}
