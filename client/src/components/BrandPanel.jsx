import styled from "styled-components";
import theme from "../theme";
import logoImg from "../assets/monogram-mb.png";

const Brand = styled.aside`
  background: ${theme.white};
  color: ${theme.dark};
  border-right: 1px solid ${theme.line};
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 1024px) {
    position: relative;
    height: auto;
    border-right: none;
    border-bottom: 1px solid ${theme.line};
  }
`;

const BrandInner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 36px;

  @media (max-width: 1024px) {
    padding: 24px 28px 20px;
  }
`;

const BrandHead = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: space-between;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const BrandHeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BrandDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.accent};
  flex-shrink: 0;
`;

const Monogram = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid ${theme.line};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const BrandName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const BrandNameMain = styled.span`
  font-family: "Crimson Pro", Georgia, serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.dark};
  line-height: 1.3;
`;

const BrandNameSub = styled.span`
  font-family: "Open Sans", system-ui, sans-serif;
  font-style: italic;
  font-size: 14px;
  color: ${theme.sandText};
  letter-spacing: 0.3px;
`;

const BrandBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 48px;

  @media (max-width: 1024px) {
    padding-top: 20px;
  }
`;

const BrandEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.accentText};
  margin-bottom: 18px;

  &::before {
    content: "";
    width: 22px;
    height: 1.5px;
    background: ${theme.accent};
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

const BrandHeadline = styled.h2`
  font-family: "Crimson Pro", Georgia, serif;
  font-weight: 300;
  font-size: 42px;
  line-height: 1.1;
  color: ${theme.dark};
  margin-bottom: 20px;
  letter-spacing: -0.5px;
  margin-top: 32px;

  em {
    font-style: italic;
    color: ${theme.accent};
  }

  @media (max-width: 1024px) {
    font-size: 28px;
    margin-bottom: 8px;
  }
`;

const BrandSub = styled.p`
  font-family: "Open Sans", system-ui, sans-serif;
  font-size: 20px;
  line-height: 1.65;
  color: ${theme.sandDark};
  max-width: 280px;
  margin-top: 10px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Stepper = styled.nav`
  margin-top: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const StepperTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.sandText};
  margin-bottom: 16px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid ${theme.line};
  cursor: pointer;
  transition: all 0.25s ease;

  &:last-child {
    border-bottom: 1px solid ${theme.line};
  }

  &:focus-visible {
    outline: 2px solid ${theme.accent};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const StepDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid
    ${({ $done, $active }) =>
      $active ? theme.accent : $done ? theme.dark : theme.line};
  background: ${({ $done, $active }) =>
    $active ? theme.accent : $done ? theme.dark : "transparent"};
  flex-shrink: 0;
  transition: all 0.25s ease;
  box-shadow: ${({ $active }) =>
    $active ? `0 0 0 3px rgba(200,117,58,0.18)` : "none"};
`;

const StepContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const StepNum = styled.span`
  font-family: "Crimson Pro", Georgia, serif;
  font-size: 16px;
  font-style: italic;
  color: ${({ $done, $active }) =>
    $active ? theme.accent : $done ? theme.sandText : theme.sandText};
  width: 20px;
  text-align: right;
  transition: color 0.25s;
`;

const StepLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $done, $active }) => ($active ? theme.dark : theme.sandText)};
  transition: color 0.25s;
`;

const STEPS = [
  { num: "01", id: 1 },
  { num: "02", label: "Vos coordonnées", id: 2 },
  { num: "03", label: "Votre commande", id: 3 },
  { num: "04", label: "Vos précisions", id: 4 },
];

export default function BrandPanel({ stepProgress, audience, onLogoClick }) {
  const activeIdx = stepProgress.findIndex((x) => !x);
  const step1Label =
    audience === "entreprise" ? "Votre entreprise" : "Votre livraison";

  const scrollToSection = (id) => {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Brand>
      <BrandInner>
        <BrandHead $clickable={!!onLogoClick} onClick={onLogoClick}>
          <BrandHeadLeft>
            <Monogram>
              <img src={logoImg} alt="Logo Maison Buna" />
            </Monogram>
            <BrandName>
              <BrandNameMain>Maison Buna</BrandNameMain>
              <BrandNameSub>Le berceau du café</BrandNameSub>
            </BrandName>
          </BrandHeadLeft>
          <BrandDot />
        </BrandHead>

        <BrandBody>
          <BrandEyebrow>Demande de devis</BrandEyebrow>
          <BrandHeadline>
            Un café <em>de caractère,</em> chez vous ou au bureau.
          </BrandHeadline>
          <BrandSub>
            Café de spécialité éthiopien, torréfié artisanalement en France.
            Livraison régulière, sans engagement.
          </BrandSub>


        </BrandBody>

        <Stepper aria-label="Navigation par étapes">
          <StepperTitle>Votre demande</StepperTitle>
          {STEPS.map((step, i) => {
            const isDone = stepProgress[i];
            const isActive = i === activeIdx;
            const label = i === 0 ? step1Label : step.label;
            return (
              <Step
                key={step.id}
                tabIndex={0}
                onClick={() => scrollToSection(step.id)}
                onKeyDown={(e) => e.key === "Enter" && scrollToSection(step.id)}
              >
                <StepDot $done={isDone} $active={isActive} />
                <StepContent>
                  <StepNum $done={isDone} $active={isActive}>
                    {step.num}
                  </StepNum>
                  <StepLabel $done={isDone} $active={isActive}>
                    {label}
                  </StepLabel>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </BrandInner>
    </Brand>
  );
}
