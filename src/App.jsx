import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  createBrowserRouter,
  Link,
  NavLink,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { getApiUrl, getPlatformFromDomain, isDomainSpecific } from "./config";
import { ARCH_NAME } from "./utils";
import { I18nProvider, LOCALES, useI18n } from "./i18n";
import HomePage from "./HomePage";
import ProductDetails from "./ProductDetails";
import HowToBurnImagesToSDCards from "./HowToBurnImagesToSDCards";

function Layout() {
  const { lang, setLang, t, tag } = useI18n();
  const [platform] = useState(getPlatformFromDomain());
  const [isSpecificDomain] = useState(isDomainSpecific());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetch(getApiUrl(platform))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((json) => !cancelled && setData(json))
      .catch((err) => {
        console.error("Error fetching data:", err);
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, [platform, attempt]);

  // Layout effect: runs before the board page's own title effect, so that one wins on board pages.
  useLayoutEffect(() => {
    document.title = t("meta.title", { arch: ARCH_NAME[platform] });
  }, [platform, t]);

  // Each platform has its own domain; elsewhere (local dev, previews) the choice is remembered locally.
  const changePlatform = (next) => {
    if (next === platform) return;
    if (isSpecificDomain) {
      const host = next === "arm" ? "images.arm.fedoravforce.org" : "images.fedoravforce.org";
      window.location.href = `${window.location.protocol}//${host}/`;
    } else {
      try {
        localStorage.setItem("platform", next);
      } catch {
        // storage blocked: the switch still works for this visit
      }
      window.location.href = "/";
    }
  };

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <Link className="brand" to="/" viewTransition aria-label={t("nav.homeAria")}>
            <img src="/images/fvf-torch.png" alt="" />
            <b>Fedora-V Force</b>
            <span>IMAGES</span>
          </Link>
          <nav className="links" aria-label={t("nav.main")}>
            <NavLink to="/" end viewTransition>{t("nav.boards")}</NavLink>
            <NavLink to="/how-to-burn-images-to-sd-cards" viewTransition>{t("nav.guide")}</NavLink>
            <a href="https://www.fedoravforce.org">fedoravforce.org ↗</a>
            <a href="https://github.com/fedora-riscv">GitHub ↗</a>
          </nav>
          <div className="arch" role="group" aria-label={t("nav.arch")}>
            {["riscv", "arm"].map((p) => (
              <button key={p} type="button" aria-pressed={platform === p} onClick={() => changePlatform(p)}>
                {ARCH_NAME[p]}
              </button>
            ))}
          </div>
          <div className="arch lang" role="group" aria-label={t("nav.language")}>
            {Object.entries(LOCALES).map(([code, l]) => (
              <button key={code} type="button" lang={l.tag} aria-pressed={lang === code} onClick={() => setLang(code)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        {data ? (
          <Outlet context={{ data, platform }} />
        ) : error ? (
          <div className="wrap" style={{ paddingBlock: 96 }}>
            <div className="empty">
              <b>{t("load.failedTitle")}</b>
              {t("load.failedText", { error: error.message })}
              <br />
              <button className="btn btn-line btn-sm" type="button" onClick={retry} style={{ marginTop: 14 }}>
                {t("load.retry")}
              </button>
            </div>
          </div>
        ) : (
          <div className="loading" role="status">
            <i />
            {t("load.loading", { arch: ARCH_NAME[platform] })}
          </div>
        )}
      </main>

      <footer>
        <div className="wrap">
          <span>
            {data
              ? t("footer.updated", {
                  time: new Date(data.latest_updated * 1000).toLocaleString(tag),
                  arch: ARCH_NAME[platform],
                })
              : ARCH_NAME[platform]}
          </span>
          <nav>
            <a href="https://www.fedoravforce.org">Fedora-V Force</a>
            <a href="https://blog.fedoravforce.com">{t("footer.blog")}</a>
            <a href="https://openkoji.iscas.ac.cn/">openkoji</a>
            <a href="https://github.com/fedora-riscv/fedorav-force-images">{t("footer.source")}</a>
          </nav>
        </div>
      </footer>
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/how-to-burn-images-to-sd-cards", element: <HowToBurnImagesToSDCards /> },
      { path: "/vendor/:vendorName", element: <HomePage /> },
      { path: "/vendor/:vendorName/:socSlug", element: <HomePage /> },
      { path: "/:productName", element: <ProductDetails /> },
    ],
  },
]);

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
