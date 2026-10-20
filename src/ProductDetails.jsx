import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Giscus from "@giscus/react";
import { getBoardPhoto, mdMap } from "./config";
import { ChipArt, Icon, StatusPill, transitionMemory } from "./components";
import {
  ARCH_NAME,
  ARCH_UNAME,
  directoryUrl,
  fileName,
  findBoard,
  formatDate,
  parseChangelog,
  socPath,
  vendorPath,
} from "./utils";
import { useI18n } from "./i18n";

const FEATURE_CLASS = { ok: "ok", ng: "ng", warning: "warning" };

const BoardDoc = lazy(() => import("./BoardDoc"));

function ImageRow({ image }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const name = fileName(image.link);
  const changelog = typeof image.changelog === "string" && image.changelog.trim() ? image.changelog : "";

  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    const selectInstead = () => {
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(image.md5).then(done, selectInstead);
    else selectInstead();
  };
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key));

  return (
    <article className="img">
      <div>
        <h4>{image.name}</h4>
        <div className="tg">
          {image.release && <span className="rel">Fedora {image.release}</span>}
          {image.live && <span className="live">Live</span>}
          {image.latest_updated && <span>{formatDate(image.latest_updated)}</span>}
        </div>
        <div className="fn">{name}</div>
      </div>
      <div className="act">
        <a className="btn btn-gold" href={image.link} target="_blank" rel="noopener noreferrer">
          {Icon.download} {t("board.download")}
        </a>
        <a className="btn btn-line btn-sm" href={directoryUrl(image.link)} target="_blank" rel="noopener noreferrer">
          {Icon.history} {t("image.allVersions")}
        </a>
      </div>
      {(image.md5 || changelog) && (
        <div className="sum">
          {image.md5 && (
            <div className="md5">
              <span className="k">MD5</span>
              <code ref={codeRef} tabIndex={0}>{image.md5}</code>
              <button className="btn btn-line btn-sm" type="button" onClick={copy}>
                {Icon.copy} {copied ? t("image.copied") : t("image.copy")}
              </button>
            </div>
          )}
          <div className="row2">
            {image.md5 && (
              <button className="tgl" type="button" aria-expanded={open === "verify"} onClick={() => toggle("verify")}>
                {t("image.verify")}
              </button>
            )}
            {changelog && (
              <button className="tgl" type="button" aria-expanded={open === "log"} onClick={() => toggle("log")}>
                {t("image.changelog")}
              </button>
            )}
          </div>
          {image.md5 && (
            <div className={`drawer${open === "verify" ? " open" : ""}`}>
              <div>
                <pre>
                  <span className="c">{t("image.verifyCd")}</span>
                  {"\n"}
                  <span className="p">$ </span>md5sum {name}
                  {"\n"}
                  {image.md5}  {name}
                  {"\n"}
                  <span className="c">{t("image.verifyMatch")}</span>
                </pre>
              </div>
            </div>
          )}
          {changelog && (
            <div className={`drawer${open === "log" ? " open" : ""}`}>
              <div>
                <ol className="clog">
                  {parseChangelog(changelog).map((entry, k) => (
                    <li key={k}>
                      <time>{entry.date || "—"}</time>
                      <div>
                        {entry.lines.length
                          ? entry.lines.map((l, i) => (
                              <span key={i}>
                                {i > 0 && <br />}
                                {l}
                              </span>
                            ))
                          : t("image.update")}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function ProductDetails() {
  const { t, tag } = useI18n();
  const { data, platform } = useOutletContext();
  const { productName } = useParams();
  const found = findBoard(data, productName);
  const [tab, setTab] = useState("downloads");
  const [animateTab, setAnimateTab] = useState(false);

  useEffect(() => {
    setTab("downloads");
    setAnimateTab(false);
    if (found) {
      transitionMemory.lastBoard = found.board.name;
    }
  }, [productName]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!found) return;
    document.title = t("meta.boardTitle", { board: found.board.name });
    return () => {
      document.title = t("meta.title", { arch: ARCH_NAME[platform] });
    };
  }, [productName, t]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!found) {
    return (
      <div className="wrap" style={{ paddingBlock: 96 }}>
        <div className="empty view">
          <b>{t("board.notFound")}</b>
          {t("board.notFoundText", {
            board: productName,
            arch: ARCH_NAME[platform],
            other: ARCH_NAME[platform === "arm" ? "riscv" : "arm"],
          })}
          <br />
          <Link className="btn btn-line btn-sm" to="/" style={{ marginTop: 14 }}>
            {t("board.back")}
          </Link>
        </div>
      </div>
    );
  }

  const { board, soc, vendor, available } = found;
  const upcoming = (board.images ?? []).filter((i) => !i.link);
  const features =
    board.features && !Array.isArray(board.features)
      ? Object.entries(board.features).filter(([, s]) => s !== null)
      : [];
  const doc = mdMap[board.name];
  const photo = getBoardPhoto(board.name);

  const tabs = [
    ["downloads", t("board.tabDownloads"), available.length],
    ...(features.length ? [["hardware", t("board.tabHardware"), features.length]] : []),
    ...(doc ? [["docs", t("board.tabDocs")]] : []),
    ["discussion", t("board.tabDiscussion")],
  ];
  const current = tabs.some(([k]) => k === tab) ? tab : "downloads";
  const pick = (k) => {
    setAnimateTab(true);
    setTab(k);
  };

  return (
    <div className="wrap view">
      <nav className="crumbs" aria-label={t("board.crumbs")}>
        {/* preventScrollReset: the catalog scrolls the board's card into view itself */}
        <Link to="/" viewTransition preventScrollReset>{t("nav.boards")}</Link>/
        <Link to={vendorPath(vendor.name)} viewTransition preventScrollReset>{vendor.name}</Link>/
        <Link to={socPath(vendor.name, soc.name)} viewTransition preventScrollReset>{soc.name}</Link>/
        <span>{board.name}</span>
      </nav>

      <section className="bhero">
        <div className={`bench ${photo?.kind ?? "none"}`}>
          {photo ? (
            <img src={photo.src} alt={board.name} style={{ viewTransitionName: "board-photo" }} />
          ) : (
            <ChipArt soc={soc.name} vendor={vendor.name} />
          )}
          <span className="arch-tag">
            {ARCH_UNAME[platform]} · {soc.name}
          </span>
        </div>
        <div className="binfo">
          <div className="ttl">
            <StatusPill status={board.board_status} />
            {board.new_product && <span className="new">{t("card.new")}</span>}
          </div>
          <h1 style={{ viewTransitionName: "board-title" }}>{board.name}</h1>
          <dl className="meta">
            <dt>{t("board.maker")}</dt>
            <dd>
              {board.vendor_link ? (
                <a href={board.vendor_link} target="_blank" rel="noopener noreferrer">{board.vendor}</a>
              ) : (
                board.vendor || "—"
              )}
            </dd>
            <dt>{t("board.soc")}</dt>
            <dd>
              {soc.link ? (
                <a href={soc.link} target="_blank" rel="noopener noreferrer">{soc.name}</a>
              ) : (
                soc.name
              )}
              <small>{vendor.name}</small>
            </dd>
            <dt>{t("board.status")}</dt>
            <dd>{["GA", "DEV", "EOL"].includes(board.board_status) ? t(`status.${board.board_status}`) : t("status.none")}</dd>
            <dt>{t("board.images")}</dt>
            <dd>
              {t("board.ready", { n: available.length })}
              {upcoming.length > 0 && <small>{t("board.planned", { n: upcoming.length })}</small>}
            </dd>
          </dl>
          <div className="links2">
            {available.length > 0 && (
              <a
                className="btn btn-gold"
                href="#downloads"
                onClick={(e) => {
                  e.preventDefault();
                  pick("downloads");
                  document.getElementById("downloads")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {Icon.download} {t("board.download")}
              </a>
            )}
            {board.link && (
              <a className="btn btn-line" href={board.link} target="_blank" rel="noopener noreferrer">
                {t("board.productPage")} {Icon.external}
              </a>
            )}
            {board.wiki_page && (
              <a className="btn btn-line" href={board.wiki_page} target="_blank" rel="noopener noreferrer">
                {t("board.wiki")} {Icon.external}
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="tabs" role="tablist" aria-label={t("board.sections")} id="downloads" style={{ scrollMarginTop: 80 }}>
        {tabs.map(([k, label, n]) => (
          <button
            key={k}
            id={`tab-${k}`}
            role="tab"
            type="button"
            aria-selected={current === k}
            aria-controls="board-panel"
            tabIndex={current === k ? 0 : -1}
            onClick={() => pick(k)}
            onKeyDown={(e) => {
              const i = tabs.findIndex(([t]) => t === k);
              const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
              if (next === null) return;
              e.preventDefault();
              const [target] = tabs[(next + tabs.length) % tabs.length];
              pick(target);
              document.getElementById(`tab-${target}`)?.focus();
            }}
          >
            {label}
            {n !== undefined && <small>{n}</small>}
          </button>
        ))}
      </div>

      <div
        className={`panel${animateTab ? " swap" : ""}`}
        key={current}
        id="board-panel"
        role="tabpanel"
        aria-labelledby={`tab-${current}`}
      >
        {current === "downloads" && (
          <div>
            {available.length > 0 && (
              <div className="img-list">
                {available.map((image) => (
                  <ImageRow key={image.link} image={image} />
                ))}
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="upcoming">
                <h3>{t("board.upcoming")}</h3>
                <p>{t("board.upcomingText")}</p>
                <ul>
                  {upcoming.map((image) => (
                    <li key={image.name}>
                      {image.name}
                      <span>{board.board_status === "EOL" ? t("board.upcomingEol") : t("board.upcomingSoon")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {available.length === 0 && upcoming.length === 0 && (
              <div className="empty">
                <b>{t("board.noImages")}</b>
                {t("board.noImagesText")}
              </div>
            )}
          </div>
        )}

        {current === "hardware" && (
          <div>
            <h3 className="sect-h">{t("board.matrix")}</h3>
            <p style={{ color: "var(--muted)", margin: 0 }}>{t("board.matrixText")}</p>
            <div className="feat">
              {features.map(([feature, state]) => (
                <div key={feature}>
                  {feature}
                  <span className={`st ${FEATURE_CLASS[String(state).toLowerCase()] ?? "unknown"}`}>{state}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {current === "docs" && (
          <Suspense fallback={<div className="loading" role="status"><i />{t("load.docs")}</div>}>
            <BoardDoc source={doc} />
          </Suspense>
        )}

        {current === "discussion" && (
          <div className="giscus-wrap">
            <h3 className="sect-h">{t("board.discussion")}</h3>
            <Giscus
              key={`${productName}|${tag}`}
              id="comments"
              repo="fedora-riscv/fedorav-force-images-discussions"
              repoId="R_kgDONI_toQ"
              category="Q&A"
              categoryId="DIC_kwDONI_toc4Cj42F"
              mapping="pathname"
              emitMetadata="0"
              inputPosition="top"
              reactionsEnabled="0"
              theme="preferred_color_scheme"
              lang={tag}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
