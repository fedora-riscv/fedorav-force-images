export const ARCH_NAME = { riscv: "RISC-V", arm: "ARM" };
export const ARCH_UNAME = { riscv: "riscv64", arm: "aarch64" };
export const STATUS_TEXT = { GA: "Generally available", DEV: "In development", EOL: "End of life" };

export const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// GA / DEV / EOL, anything else (e.g. "Unknown") is grouped as UNK.
export const statusKey = (s) => (["GA", "DEV", "EOL"].includes(s) ? s : "UNK");

// The API sends dates like "2025/9/7".
export const parseDate = (s) => {
  if (!s) return 0;
  const [y, m, d] = String(s).split(/[/-]/).map(Number);
  const t = new Date(y, (m || 1) - 1, d || 1).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export const formatTime = (t) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatDate = (s) => {
  const t = parseDate(s);
  return t ? formatTime(t) : "";
};

// Giscus maps discussions by pathname. encodeURIComponent gives the same path the old
// raw `/${name}` links produced for every current board name (spaces -> %20, ( ) _ kept);
// check the thread mapping before renaming a board to something with + & , ; = : @ $.
export const boardPath = (name) => `/${encodeURIComponent(name)}`;
export const vendorPath = (vendor) => `/vendor/${encodeURIComponent(vendor)}`;
export const socPath = (vendor, soc) => `${vendorPath(vendor)}/${slugify(soc)}`;

// Flatten vendor -> soc -> boards into one list with the derived fields the UI needs.
export const flattenBoards = (data) => {
  const out = [];
  for (const vendor of data?.result ?? []) {
    for (const soc of vendor.soc ?? []) {
      for (const board of soc.boards ?? []) {
        const images = board.images ?? [];
        const available = images.filter((i) => i.link);
        const latest = available.reduce((a, i) => Math.max(a, parseDate(i.latest_updated)), 0);
        const releases = [...new Set(available.map((i) => i.release).filter(Boolean))].sort((a, b) => b - a);
        out.push({ board, soc, vendor, available, latest, releases });
      }
    }
  }
  return out;
};

export const findBoard = (data, name) => flattenBoards(data).find((x) => x.board.name === name) ?? null;

export const fileName = (link) => {
  try {
    return decodeURIComponent(new URL(link).pathname.split("/").pop());
  } catch {
    return link;
  }
};

export const directoryUrl = (link) => link.substring(0, link.lastIndexOf("/") + 1);

// Changelog text comes as "2025/10/21:\nline\nline\n\n2025/09/01:\nline".
export const parseChangelog = (text) =>
  String(text)
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const m = lines[0]?.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2}):?$/);
      return m
        ? { date: `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`, lines: lines.slice(1) }
        : { date: "", lines };
    });
