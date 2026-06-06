import { useState } from "react";
import styled from "styled-components";
import theme from "../theme";
import BrandPanel from "./BrandPanel";
import AudienceToggle from "./AudienceToggle";
import SectionProfil from "./SectionProfil";
import SectionContact from "./SectionContact";
import SectionCommande from "./SectionCommande";
import SectionPrecisions from "./SectionPrecisions";
import SuccessView from "./SuccessView";
import { PrimaryButton } from "./Reusable-ui/Button";
import {
  validate,
  computeStepProgress,
  buildPayload,
  INITIAL_FORM_DATA,
} from "../utils/formUtils";

const Shell = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  min-height: 100vh;
  background: ${theme.creamSoft};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FormArea = styled.main`
  padding: 56px 72px 80px;
  max-width: 920px;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 48px 32px 64px;
  }
  @media (max-width: 640px) {
    padding: 32px 20px 56px;
  }
`;

const FormMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${theme.sand};
  margin-bottom: 32px;
  text-transform: uppercase;
`;


const PageTitle = styled.h1`
  font-family: "Cormorant Garamond", serif;
  font-weight: 400;
  font-size: 52px;
  line-height: 1.05;
  color: ${theme.brown};
  margin-bottom: 16px;
  letter-spacing: -1px;

  em {
    font-style: italic;
    color: ${theme.accent};
  }

  @media (max-width: 1024px) {
    font-size: 40px;
  }
  @media (max-width: 640px) {
    font-size: 32px;
  }
`;

const PageIntro = styled.p`
  color: ${theme.sandDark};
  font-size: 16px;
  line-height: 1.6;
  max-width: 520px;
  margin-bottom: 56px;
`;

const SubmitArea = styled.div`
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px solid ${theme.line};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    button {
      justify-content: center;
    }
  }
`;

const SubmitNote = styled.p`
  font-size: 13px;
  color: ${theme.sandDark};
  line-height: 1.6;
  max-width: 320px;

  strong {
    color: ${theme.brown};
    font-weight: 500;
  }
`;

export default function DevisForm() {
  const [audience, setAudience] = useState("entreprise");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [surDevis, setSurDevis] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
    }
  };

  const handleAudienceChange = (aud) => {
    setAudience(aud);
    setFormData((prev) => ({ ...prev, quantiteParCafe: {} }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData, audience);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      const domId =
        firstKey === "quantiteParCafe" ? "field-cafes" : `field-${firstKey}`;
      document
        .getElementById(domId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(formData, audience)),
      });
      if (!res.ok)
        throw new Error("Erreur lors de l'envoi. Veuillez réessayer.");
      const hasSurDevis = formData.cafes.some(
        (cafe) => formData.quantiteParCafe[cafe] === "À estimer",
      );
      setSurDevis(hasSurDevis);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setAudience("entreprise");
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepProgress = computeStepProgress(formData, audience);
  const isEnt = audience === "entreprise";

  if (submitted) {
    return (
      <Shell>
        <BrandPanel
          stepProgress={[true, true, true, true]}
          audience={audience}
          onLogoClick={handleReset}
        />
        <FormArea>
          <SuccessView
            formData={formData}
            audience={audience}
            onReset={handleReset}
            surDevis={surDevis}
          />
        </FormArea>
      </Shell>
    );
  }

  return (
    <Shell>
      <BrandPanel stepProgress={stepProgress} audience={audience} />
      <FormArea>
        <FormMeta>
          <span>Demande de devis</span>
        </FormMeta>

        <PageTitle>
          Parlons de votre <em>café</em>.
        </PageTitle>
        <PageIntro>
          {isEnt
            ? "Vos besoins, notre expertise. Un devis sur-mesure en quelques minutes."
            : "Quelques détails sur vos goûts et votre adresse, et nous préparons votre première sélection."}
        </PageIntro>

        <AudienceToggle audience={audience} onChange={handleAudienceChange} />

        <form onSubmit={handleSubmit} noValidate>
          <SectionProfil
            audience={audience}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
          <SectionContact
            audience={audience}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
          <SectionCommande
            audience={audience}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
          <SectionPrecisions
            formData={formData}
            audience={audience}
            onChange={handleChange}
          />

          <SubmitArea>
            <SubmitNote>
              <strong>Devis en quelques minutes</strong>
              <br />
              {isEnt && "Aucun engagement."}
            </SubmitNote>
            <PrimaryButton type="submit" disabled={loading}>
              <span>{loading ? "Envoi en cours…" : "Envoyer ma demande"}</span>
              {!loading && (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path
                    d="M1 6h13M9 1l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </PrimaryButton>
          </SubmitArea>
        </form>
      </FormArea>
    </Shell>
  );
}
