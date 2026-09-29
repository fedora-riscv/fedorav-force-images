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

const STATUS_FILTERS = [
  ["all", "All"],
  ["GA", "GA"],
  ["DEV", "DEV"],
  ["EOL", "EOL"],
  ["UNK", "Unknown"],
];

// Search text and status filter survive a round trip to a board page.
const filterMemory = { query: "", status: "all" };

export default function HomePage() {
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
                  <span>Pick a board.</span>
                </span>{" "}
                <span className="ln">
                  <span>
                    Flash <span className="v">Fedora.</span>
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
                  placeholder={`Search ${all.length} boards, SoCs or vendors`}
                  aria-label="Search boards"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd>/</kbd>
              </label>
              <div className="stats">
                <span><b>{all.length}</b>boards</span>
                <span><b>{imageCount}</b>images</span>
                <span><b>{vendors.length}</b>chip vendors</span>
                <span className="hot"><b>{newCount}</b>new</span>
              </div>
            </div>
          </div>
          {recent.length > 0 && (
            <div className="log" aria-label="Recently updated images">
              <span>Recently updated</span>
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
                                <em>NEW</em>
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
        <aside className="index" aria-label="Chip vendors">
          <h4>Chip vendors</h4>
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
            <h4>Help</h4>
            <Link to="/how-to-burn-images-to-sd-cards" viewTransition>How to flash an SD card →</Link>
            <a href="https://blog.fedoravforce.com">Test reports on the blog ↗</a>
          </div>
        </aside>

        <div ref={catalogRef} className="catalog" style={{ scrollMarginTop: 88 }}>
          <div className="vchips" role="group" aria-label="Chip vendor">
            <Link className="chip" to="/" aria-current={!vendor ? "page" : undefined}>All</Link>
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
                "All boards"
              )}
              <small>{list.length} shown</small>
            </h2>
            <div className="filters" role="group" aria-label="Board status">
              <span className="lab">Status</span>
              {STATUS_FILTERS.filter(([k]) => k === "all" || counts[k]).map(([k, label]) => (
                <button key={k} className="chip" type="button" aria-pressed={status === k} onClick={() => setStatus(k)}>
                  {label} {counts[k]}
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
              <b>No SoC “{socSlug}” under {vendor.name}</b>
              Showing all {vendor.name} boards instead.
            </div>
          )}
          {vendorName && !vendor ? (
            <div className="empty">
              <b>No vendor called “{vendorName}”</b>
              It may be listed under the other architecture.
              <br />
              <Link className="btn btn-line btn-sm" to="/" style={{ marginTop: 14 }}>Show all boards</Link>
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
                      {items.length} board{items.length > 1 ? "s" : ""}
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
              <b>{q ? `No boards match “${query}”` : "No boards with this status"}</b>
              Try a board, SoC or vendor name such as “K1”, “TH1520” or “Milk-V”.
              <br />
              <button className="btn btn-line btn-sm" type="button" onClick={resetFilters} style={{ marginTop: 14 }}>
                Clear search and filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
