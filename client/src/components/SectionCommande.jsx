import styled from "styled-components";
import theme from "../theme";
import SectionHead from "./Reusable-ui/SectionHead";
import ChoiceGrid from "./Reusable-ui/ChoiceGrid";
import CoffeeGrid from "./CoffeeGrid";

const Section = styled.section`
  padding-top: 48px;
  margin-bottom: 8px;
  scroll-margin-top: 24px;
`;

const FieldBlock = styled.div`
  margin-bottom: 20px;
  ${({ $full }) => $full && "grid-column: 1 / -1;"}

  & + & {
    margin-top: 28px;
  }
`;

const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.brown};
  margin-bottom: 8px;
  letter-spacing: 0.2px;

  span.req {
    color: ${theme.accent};
    margin-left: 2px;
  }
  span.opt {
    color: ${theme.sand};
    font-weight: 400;
    margin-left: 6px;
    font-size: 11px;
  }
`;

const ENT_QTE_OPTIONS = [
  { value: "250 g", label: "250 g" },
  { value: "500 g – 1 kg", label: "500 g–1 kg" },
  { value: "1 – 3 kg", label: "1–3 kg" },
  { value: "3 – 5 kg", label: "3–5 kg" },
  { value: "À estimer", label: "Sur mesure" },
];

const PART_QTE_OPTIONS = [
  { value: "250 g — Découverte", label: "250 g" },
  { value: "500 g — 1 personne", label: "500 g" },
  { value: "1 kg — Couple", label: "1 kg" },
  { value: "2 kg — Famille", label: "2 kg" },
  { value: "Abonnement découverte", label: "Abonnement" },
  { value: "Coffret cadeau", label: "Coffret" },
];

const FREQUENCE = [
  { value: "Hebdomadaire", label: "Hebdo", sub: "Chaque semaine" },
  { value: "Bi-mensuelle", label: "Bi-mensuelle", sub: "Tous les 15 j" },
  { value: "Mensuelle", label: "Mensuelle", sub: "Une fois / mois" },
  { value: "Ponctuelle", label: "Ponctuelle", sub: "Événementiel" },
];

const MoutureChip = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  border: 1.5px solid ${theme.brown};
  border-radius: 8px;
  background: ${theme.creamSoft};
  cursor: default;

  span.label {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.dark};
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: "✓";
      display: inline-block;
      width: 16px;
      height: 16px;
      background: ${theme.brown};
      color: ${theme.creamSoft};
      border-radius: 50%;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
      flex-shrink: 0;
    }
  }

  span.sub {
    font-size: 11px;
    color: ${theme.sand};
    padding-left: 22px;
  }
`;

const MoutureNote = styled.p`
  margin: 8px 0 0;
  font-size: 11px;
  color: ${theme.sand};
  font-style: italic;
`;

export default function SectionCommande({
  audience,
  formData,
  errors,
  onChange,
}) {
  const isEnt = audience === "entreprise";

  return (
    <Section id="section-3" data-step="3">
      <SectionHead num="03" title="Votre commande" step="Étape 3 / 4" />

      <FieldBlock id="field-cafes">
        <FieldLabel>
          Café(s) souhaité(s) <span className="req">*</span>{" "}
          <span className="opt">sélectionnez et choisissez la quantité</span>
        </FieldLabel>
        <CoffeeGrid
          value={formData.cafes}
          onChange={(arr) => onChange("cafes", arr)}
          quantiteParCafe={formData.quantiteParCafe}
          onQuantiteChange={(cafe, qte) => {
            if (!formData.cafes.includes(cafe)) {
              onChange("cafes", [...formData.cafes, cafe]);
            }
            onChange("quantiteParCafe", {
              ...formData.quantiteParCafe,
              [cafe]: qte,
            });
          }}
          quantiteOptions={isEnt ? ENT_QTE_OPTIONS : PART_QTE_OPTIONS}
          error={errors.cafes}
          errorQuantite={errors.quantiteParCafe}
        />
      </FieldBlock>

      <FieldBlock style={{ marginTop: "28px" }}>
        <FieldLabel>
          {isEnt ? "Fréquence de livraison" : "Fréquence souhaitée"}{" "}
          <span className="opt">facultatif</span>
        </FieldLabel>
        <ChoiceGrid
          cols={4}
          type="radio"
          name="frequence"
          value={formData.frequence}
          onChange={(v) => onChange("frequence", v)}
          options={FREQUENCE}
        />
      </FieldBlock>

      <FieldBlock style={{ marginTop: "28px" }}>
        <FieldLabel>Mouture</FieldLabel>
        <MoutureChip>
          <span className="label">Grains entiers</span>
          <span className="sub">À moudre soi-même</span>
        </MoutureChip>
        <MoutureNote>D'autres moutures disponibles prochainement.</MoutureNote>
      </FieldBlock>
    </Section>
  );
}
