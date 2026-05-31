import styled from "styled-components";
import theme from "../theme";

const Audience = styled.div`
  margin-bottom: 48px;
`;

const AudienceLabel = styled.div`
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${theme.sand};
  margin-bottom: 12px;
  font-weight: 500;
`;

const Toggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: ${theme.creamSoft};
  border: 1px solid ${theme.line};
  border-radius: 14px;
  padding: 6px;
`;

const AudOpt = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 10px;
  background: ${({ $active }) => ($active ? theme.white : "transparent")};
  border: 1px solid ${({ $active }) => ($active ? theme.brown : "transparent")};
  box-shadow: ${({ $active }) =>
    $active
      ? `0 1px 0 ${theme.brown}, 0 4px 14px rgba(61,40,23,0.10)`
      : "none"};
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
  font-family: inherit;
  color: ${theme.brown};
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.55);
  }
`;

const AudIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? theme.brown : theme.white)};
  color: ${({ $active }) => ($active ? theme.cream : theme.sandDark)};
  border: 1px solid ${({ $active }) => ($active ? theme.brown : theme.line)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
`;

const AudText = styled.span`
  line-height: 1.3;
`;
const AudTitle = styled.span`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.brown};
  letter-spacing: -0.1px;
`;
const AudSub = styled.span`
  display: block;
  font-size: 12px;
  color: ${theme.sand};
  margin-top: 2px;
  font-weight: 400;
`;

export default function AudienceToggle({ audience, onChange }) {
  return (
    <Audience>
      <AudienceLabel>Vous commandez pour…</AudienceLabel>
      <Toggle role="radiogroup">
        <AudOpt
          type="button"
          $active={audience === "entreprise"}
          role="radio"
          aria-checked={audience === "entreprise"}
          onClick={() => onChange("entreprise")}
        >
          <AudIcon $active={audience === "entreprise"}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M5 21V8l7-4 7 4v13" />
              <path d="M9 9h.01M13 9h.01M9 13h.01M13 13h.01M9 17h.01M13 17h.01" />
            </svg>
          </AudIcon>
          <AudText>
            <AudTitle>Mon entreprise</AudTitle>
          </AudText>
        </AudOpt>

        <AudOpt
          type="button"
          $active={audience === "particulier"}
          role="radio"
          aria-checked={audience === "particulier"}
          onClick={() => onChange("particulier")}
        >
          <AudIcon $active={audience === "particulier"}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11l9-7 9 7" />
              <path d="M5 9.5V21h14V9.5" />
              <path d="M10 21v-6h4v6" />
            </svg>
          </AudIcon>
          <AudText>
            <AudTitle>Moi à la maison</AudTitle>
          </AudText>
        </AudOpt>
      </Toggle>
    </Audience>
  );
}
