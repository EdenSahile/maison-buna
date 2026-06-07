import styled from "styled-components";
import theme from "../theme";

const Panel = styled.aside`
  background: ${theme.white};
  border-left: 1px solid ${theme.line};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  padding: 40px 20px 36px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1280px) {
    display: none;
  }
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.accentText};
  margin-bottom: 24px;

  &::before {
    content: "";
    width: 18px;
    height: 1.5px;
    background: ${theme.accent};
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

const Quote = styled.blockquote`
  font-family: "Crimson Pro", Georgia, serif;
  font-weight: 300;
  font-style: italic;
  font-size: 22px;
  line-height: 1.35;
  color: ${theme.dark};
  letter-spacing: -0.2px;
  margin: 0 0 10px;

  em {
    font-style: normal;
    color: ${theme.accent};
  }
`;

const Pronunciation = styled.p`
  font-family: "Open Sans", system-ui, sans-serif;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: ${theme.sandText};
  font-style: italic;
  margin: 0 0 28px;
`;

const Divider = styled.div`
  width: 32px;
  height: 1px;
  background: ${theme.line};
  margin-bottom: 28px;
`;

const Facts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const Fact = styled.div``;

const FactLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: ${theme.sandText};
  margin-bottom: 4px;
`;

const FactText = styled.div`
  font-family: "Open Sans", system-ui, sans-serif;
  font-size: 12.5px;
  line-height: 1.6;
  color: ${theme.sandDark};
`;

const BeanDecor = styled.div`
  position: relative;
  height: 120px;
  margin-top: auto;
  pointer-events: none;
  overflow: hidden;
`;

export default function EditorialPanel() {
  return (
    <Panel aria-hidden="true">
      <Eyebrow>Ethiopie · Spécialité</Eyebrow>

      <Quote>
        <em>Buna</em>
        {" — le mot amharique pour « café »."}
      </Quote>
      <Pronunciation>
        se prononce « <span style={{ color: theme.accent }}>bouna</span>
        {" »"}
      </Pronunciation>

      <Divider />

      <Facts>
        <Fact>
          <FactLabel>Grade 1 Arabica</FactLabel>
          <FactText>
            L'excellence du café éthiopien, reconnue à l'international.
          </FactText>
        </Fact>
        <Fact>
          <FactLabel>Traçabilité</FactLabel>
          <FactText>
            Sourcé via Heleph Coffee, partenaire éthiopien direct.
          </FactText>
        </Fact>
        <Fact>
          <FactLabel>Torréfaction</FactLabel>
          <FactText>
            Torréfié à la commande en France, pour préserver chaque arôme.
          </FactText>
        </Fact>
      </Facts>

      <BeanDecor aria-hidden="true">
        <svg
          style={{
            position: "absolute",
            bottom: 8,
            right: 16,
            transform: "rotate(22deg)",
            opacity: 0.35,
          }}
          viewBox="0 0 40 62"
          width="62"
          height="96"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse cx="20" cy="31" rx="18" ry="29" fill="#C4AE92" />
          <path
            d="M20 4 Q12 31 20 58"
            stroke="#705540"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <svg
          style={{
            position: "absolute",
            bottom: 20,
            left: 10,
            transform: "rotate(-18deg)",
            opacity: 0.22,
          }}
          viewBox="0 0 40 62"
          width="42"
          height="65"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse cx="20" cy="31" rx="18" ry="29" fill="#C4AE92" />
          <path
            d="M20 4 Q12 31 20 58"
            stroke="#705540"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <svg
          style={{
            position: "absolute",
            bottom: 50,
            right: 70,
            transform: "rotate(55deg)",
            opacity: 0.16,
          }}
          viewBox="0 0 40 62"
          width="26"
          height="40"
          aria-hidden="true"
          focusable="false"
        >
          <ellipse cx="20" cy="31" rx="18" ry="29" fill="#C4AE92" />
          <path
            d="M20 4 Q12 31 20 58"
            stroke="#705540"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </BeanDecor>
    </Panel>
  );
}
