import { useEffect } from "react";
import { Link } from "react-router-dom";
import { transitionMemory } from "./components";
import { useI18n } from "./i18n";

// Screenshots for each step; titles and text come from guide.steps in the locale files.
const STEP_IMAGES = [
  ["/images/burn-images-to-sd-01.webp"],
  ["/images/burn-images-to-sd-02.webp"],
  ["/images/burn-images-to-sd-03.webp", "/images/burn-images-to-sd-04.webp"],
  ["/images/burn-images-to-sd-05.webp", "/images/burn-images-to-sd-06.webp"],
  ["/images/burn-images-to-sd-07.webp"],
];

const etcher = (
  <a href="https://etcher.balena.io" target="_blank" rel="noopener noreferrer">balenaEtcher</a>
);

export default function HowToBurnImagesToSDCards() {
  const { t } = useI18n();

  // Leaving a board for the guide: the catalog should not try to morph back to that board later.
  useEffect(() => {
    transitionMemory.lastBoard = null;
  }, []);

  return (
    <div className="wrap view">
      <div className="guide-h">
        <div className="eyebrow">{t("guide.eyebrow")}</div>
        <h1>{t("guide.title")}</h1>
        <p>{t("guide.lead")}</p>
      </div>
      <div className="prep">
        <div>
          <h3>{t("guide.need")}</h3>
          <ul>
            {t("guide.needItems").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="warn">
          <h3>{t("guide.before")}</h3>
          <ul>
            {t("guide.beforeItems").map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <ol className="steps">
        {STEP_IMAGES.map((images, k) => (
          <li key={images[0]}>
            <div className="tx">
              <h3>{t(`guide.steps.${k}.title`)}</h3>
              <p>{t(`guide.steps.${k}.text`, { etcher })}</p>
            </div>
            <div className={`shots${images.length > 1 ? " two" : ""}`}>
              {images.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </li>
        ))}
        <li style={{ display: "block" }}>
          <div className="done">
            <h3>
              {t("guide.done", { v: <span className="v">{t("guide.doneEmphasis")}</span> })}
            </h3>
            <Link className="btn btn-gold" to="/" viewTransition>{t("guide.browse")}</Link>
          </div>
        </li>
      </ol>
    </div>
  );
}
