import { Link, useViewTransitionState } from "react-router-dom";
import { getBoardPhoto } from "./config";
import { boardPath, formatTime, statusKey } from "./utils";

// Name of the board page the visitor just left, so its card can morph back into place.
export const transitionMemory = { lastBoard: null };

export const Icon = {
  download: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" /></svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" /></svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 15V5h10" /></svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4M12 8v4l3 2" /></svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
  ),
};

// Boards without a photo get a drawn SoC package with the part number etched on it.
export function ChipArt({ soc, vendor = "" }) {
  const label = String(soc).replace(/（.*?）|\(.*?\)/g, "").trim();
  const size = Math.min(26, Math.max(11, 90 / (label.length * 0.6)));
  const pins = [];
  for (let k = 0; k < 9; k++) {
    const o = 46 + k * 13.5 - 2.5;
    pins.push(
      <rect key={`t${k}`} x={o} y="22" width="5" height="16" rx="1.5" />,
      <rect key={`b${k}`} x={o} y="162" width="5" height="16" rx="1.5" />,
      <rect key={`l${k}`} x="22" y={o} width="16" height="5" rx="1.5" />,
      <rect key={`r${k}`} x="162" y={o} width="16" height="5" rx="1.5" />
    );
  }
  return (
    <svg className="chipart" viewBox="0 0 200 200" role="img" aria-label={`${label} package`}>
      <g className="pins">{pins}</g>
      <rect className="pkg" x="36" y="36" width="128" height="128" rx="10" />
      <rect className="die" x="50" y="50" width="100" height="100" rx="5" />
      <circle className="pin1" cx="60" cy="60" r="4" />
      <text className="pn" x="100" y={104 + size * 0.18} textAnchor="middle" fontSize={size.toFixed(1)}>
        {label}
      </text>
      {vendor && (
        <text className="sub" x="100" y="136" textAnchor="middle">
          {vendor.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

export function StatusPill({ status }) {
  return <span className={`pill ${statusKey(status)}`}>{status || "Unknown"}</span>;
}

export function BoardCard({ item, index = 0, returning = false }) {
  const { board, soc, vendor, available, latest, releases } = item;
  const to = boardPath(board.name);
  const opening = useViewTransitionState(to);
  const photo = getBoardPhoto(board.name);
  const morph = opening || returning;
  return (
    <Link className="card" to={to} viewTransition style={{ "--i": Math.min(index, 18) }} data-board={board.name}>
      <div className={`ph ${photo?.kind ?? "none"}`}>
        {photo ? (
          <img
            src={photo.src}
            alt={board.name}
            loading="lazy"
            style={morph ? { viewTransitionName: "board-photo" } : undefined}
          />
        ) : (
          <ChipArt soc={soc.name} vendor={vendor.name} />
        )}
        <div className="tags">
          <StatusPill status={board.board_status} />
          {board.new_product && <span className="new">NEW</span>}
        </div>
      </div>
      <div className="bd">
        <div>
          <h4 style={morph ? { viewTransitionName: "board-title" } : undefined}>{board.name}</h4>
          <div className="sub">
            {soc.name}
            {board.vendor ? ` · ${board.vendor}` : ""}
          </div>
        </div>
        <div className="ft">
          <span>
            <b>{available.length}</b> image{available.length === 1 ? "" : "s"}
            {releases[0] ? ` · F${releases[0]}` : ""}
          </span>
          <span>{latest ? formatTime(latest) : available.length ? "ready" : "coming soon"}</span>
        </div>
      </div>
    </Link>
  );
}
