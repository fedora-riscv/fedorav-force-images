import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { getBoardPhoto } from "./config";
import { BoardCard, ChipArt, Icon, transitionMemory } from "./components";
import {
  ARCH_UNAME,
  boardPath,
  flattenBoards,
  formatDate,
  parseDate,
  slugify,
  socPath,
  statusKey,
  vendorPath,
} from "./utils";
import { useI18n } from "./i18n";

// Labels are message keys; GA / DEV / EOL are shown as-is in every language.
const STATUS_FILTERS = [
  ["all", "status.all"],
  ["GA", null],
  ["DEV", null],
  ["EOL", null],
  ["UNK", "status.unknown"],
];

// Search text and status filter survive a round trip to a board page.
const filterMemory = { query: "", status: "all" };

export default function HomePage() {
  const { t } = useI18n();
  const { data, platform } = useOutletContext();
  const { vendorName, socSlug } = useParams();
  const [query, setQuery] = useState(filterMemory.query);
  const [status, setStatus] = useState(filterMemory.status);
  const [returning, setReturning] = useState(transitionMemory.lastBoard);
  const searchRef = useRef(null);
  const catalogRef = useRef(null);
  const firstRender = useRef(true);

  const vendors = data.result;
  const all = useMemo(() => flattenBoards(data), [data]);
  // Vendor names in links are matched case-insensitively, as on the old vendor pages.
  const vendor = vendorName
    ? vendors.find((v) => v.name.toLowerCase() === vendorName.toLowerCase()) ?? null
    : null;
  const soc = vendor && socSlug ? (vendor.soc ?? []).find((s) => slugify(s.name) === socSlug) ?? null : null;
  const socMissing = Boolean(vendor && socSlug && !soc);

  useEffect(() => {
    filterMemory.query = query;
    filterMemory.status = status;
  }, [query, status]);

  // Coming back from a board page: bring its card into view so the photo can morph back into it.
  useLayoutEffect(() => {
    if (!returning) return;
    document.querySelector(`[data-board="${CSS.escape(returning)}"]`)?.scrollIntoView({ block: "center" });
    transitionMemory.lastBoard = null;
    const t = setTimeout(() => setReturning(null), 700);
    return () => clearTimeout(t);
  }, [returning]);

  // Picking a vendor or SoC scrolls the catalog to the top of the screen.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (!vendorName || returning) return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() =>
      catalogRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" })
    );
  }, [vendorName, socSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // "/" focuses the search box.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName ?? "")) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const counts = { all: all.length, GA: 0, DEV: 0, EOL: 0, UNK: 0 };
  all.forEach((x) => counts[statusKey(x.board.board_status)]++);

  const q = query.trim().toLowerCase();
  const list = all.filter((x) => {
    if (vendor && x.vendor !== vendor) return false;
    if (soc && x.soc !== soc) return false;
    if (status !== "all" && statusKey(x.board.board_status) !== status) return false;
    if (!q) return true;
    return [x.board.name, x.board.vendor, x.soc.name, x.vendor.name].some((s) =>
      String(s ?? "").toLowerCase().includes(q)
    );
  });
  const groups = vendors.map((v) => ({ v, items: list.filter((x) => x.vendor === v) })).filter((g) => g.items.length);

  const imageCount = all.reduce((a, x) => a + x.available.length, 0);
  const newCount = all.filter((x) => x.board.new_product).length;
  const recent = all
    .flatMap((x) => x.available.map((image) => ({ x, image, t: parseDate(image.latest_updated) })))
    .sort((a, b) => b.t - a.t)
    .slice(0, 5);

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
  };

  return (
    <>
      <section className="hero view">
        <div className="wrap">
          <div className="hrow">
            <div>
              <div className="kicker">
                <span className="dot" />
                <span>
                  $ uname -m <b>{ARCH_UNAME[platform]}</b>
                </span>
                <span>多啦V盟</span>
                <span>mirror.iscas.ac.cn</span>
              </div>
              <h1>
                <span className="ln">
                  <span>{t("home.line1")}</span>
                </span>{" "}
                <span className="ln">
                  <span>
                    {t("home.line2", { fedora: <span className="v">{t("home.fedora")}</span> })}
                  </span>
                </span>
              </h1>
            </div>
            <div>
              <label className="search" htmlFor="q">
                {Icon.search}
                <input
                  id="q"
                  ref={searchRef}
                  type="search"
                  autoComplete="off"
                  placeholder={t("home.searchPlaceholder", { n: all.length })}
                  aria-label={t("home.searchAria")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd>/</kbd>
              </label>
              <div className="stats">
                <span><b>{all.length}</b>{t("home.statBoards")}</span>
                <span><b>{imageCount}</b>{t("home.statImages")}</span>
                <span><b>{vendors.length}</b>{t("home.statVendors")}</span>
                <span className="hot"><b>{newCount}</b>{t("home.statNew")}</span>
              </div>
            </div>
          </div>
          {recent.length > 0 && (
            <div className="log" aria-label={t("home.recentAria")}>
              <span>{t("home.recent")}</span>
              <ol>
                {recent.map(({ x, image }) => {
                  const photo = getBoardPhoto(x.board.name);
                  return (
                    <li key={`${x.board.name}-${image.link}`}>
                      <Link to={boardPath(x.board.name)} viewTransition>
                        <span className="th">
                          {photo ? <img src={photo.src} alt="" /> : <ChipArt soc={x.soc.name} />}
                        </span>
                        <span className="t">
                          <b>{x.board.name}</b>
                          <small>
                            {String(image.name ?? "").replace(/^Fedora /, "")} · {formatDate(image.latest_updated).slice(5)}
                            {x.board.new_product && (
                              <>
                                {" · "}
                                <em>{t("card.new")}</em>
                              </>
                            )}
                          </small>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </section>

      <div className="wrap cat">
        <aside className="index" aria-label={t("home.vendors")}>
          <h4>{t("home.vendors")}</h4>
          <ul>
            {vendors.map((v) => (
              <li key={v.name}>
                <Link to={vendorPath(v.name)} aria-current={vendor === v && !soc ? "true" : undefined}>
                  {v.name}
                  <small>{(v.soc ?? []).reduce((a, s) => a + (s.boards ?? []).length, 0)}</small>
                </Link>
                <div className="socs">
                  {(v.soc ?? []).map((s) => (
                    <Link key={s.name} to={socPath(v.name, s.name)} aria-current={soc === s ? "true" : undefined}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="help">
            <h4>{t("home.help")}</h4>
            <Link to="/how-to-burn-images-to-sd-cards" viewTransition>{t("home.helpFlash")}</Link>
            <a href="https://blog.fedoravforce.com">{t("home.helpReports")}</a>
          </div>
        </aside>

        <div ref={catalogRef} className="catalog" style={{ scrollMarginTop: 88 }}>
          <div className="vchips" role="group" aria-label={t("home.vendorChips")}>
            <Link className="chip" to="/" aria-current={!vendor ? "page" : undefined}>{t("status.all")}</Link>
            {vendors.map((v) => (
              <Link key={v.name} className="chip" to={vendorPath(v.name)} aria-current={vendor === v ? "page" : undefined}>
                {v.name}
              </Link>
            ))}
          </div>
          <div className="toolbar">
            <h2>
              {soc ? (
                <>
                  {soc.name}
                  <span className="of">{vendor.name}</span>
                </>
              ) : vendor ? (
                vendor.name
              ) : (
                t("home.allBoards")
              )}
              <small>{t("home.shown", { n: list.length })}</small>
            </h2>
            <div className="filters" role="group" aria-label={t("home.statusAria")}>
              <span className="lab">{t("home.statusLabel")}</span>
              {STATUS_FILTERS.filter(([k]) => k === "all" || counts[k]).map(([k, label]) => (
                <button key={k} className="chip" type="button" aria-pressed={status === k} onClick={() => setStatus(k)}>
                  {label ? t(label) : k} {counts[k]}
                </button>
              ))}
              {vendor && (
                <Link className="chip" to="/">
                  ✕ {soc ? soc.name : vendor.name}
                </Link>
              )}
            </div>
          </div>

          {socMissing && (
            <div className="empty" style={{ marginBottom: 28 }}>
              <b>{t("home.socMissing", { soc: socSlug, vendor: vendor.name })}</b>
              {t("home.socMissingText", { vendor: vendor.name })}
            </div>
          )}
          {vendorName && !vendor ? (
            <div className="empty">
              <b>{t("home.vendorMissing", { vendor: vendorName })}</b>
              {t("home.vendorMissingText")}
              <br />
              <Link className="btn btn-line btn-sm" to="/" style={{ marginTop: 14 }}>{t("home.showAll")}</Link>
            </div>
          ) : groups.length ? (
            <div
              key={`${vendorName}|${socSlug}|${status}`}
              className={`stagger${q ? " quick" : ""}`}
              // A card still named for the return morph must drop the name before another card
              // claims it, or the browser aborts the transition on the duplicate name.
              onClickCapture={() => returning && flushSync(() => setReturning(null))}
            >
              {groups.map(({ v, items }) => (
                <section className="vendor" key={v.name}>
                  <div className="vhead">
                    <h3>
                      {v.link ? (
                        <a href={v.link} target="_blank" rel="noopener noreferrer">{v.name}</a>
                      ) : (
                        v.name
                      )}
                    </h3>
                    <span className="soc">
                      {(v.soc ?? []).map((s, k) => (
                        <span key={s.name}>
                          {k > 0 && " · "}
                          <Link to={socPath(v.name, s.name)}>{s.name}</Link>
                        </span>
                      ))}
                    </span>
                    <span className="cnt">
                      {t("home.boardCount", { count: items.length, n: items.length })}
                    </span>
                  </div>
                  <div className="grid">
                    {items.map((x, k) => (
                      <BoardCard key={x.board.name} item={x} index={k} returning={returning === x.board.name} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="empty">
              <b>{q ? t("home.noMatch", { query }) : t("home.noStatus")}</b>
              {t("home.emptyHint")}
              <br />
              <button className="btn btn-line btn-sm" type="button" onClick={resetFilters} style={{ marginTop: 14 }}>
                {t("home.clear")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
