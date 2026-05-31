import styled from 'styled-components'
import theme from '../../theme'

const Head = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.line};
`

const Num = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 22px;
  color: ${theme.accent};
  line-height: 1;
`

const Title = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: 26px;
  color: ${theme.brown};
  letter-spacing: -0.3px;
`

const Meta = styled.span`
  margin-left: auto;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.sand};

  @media (max-width: 640px) { display: none; }
`

export default function SectionHead({ num, title, step }) {
  return (
    <Head>
      <Num>{num}</Num>
      <Title>{title}</Title>
      <Meta>{step}</Meta>
    </Head>
  )
}
