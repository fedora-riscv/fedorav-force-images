import { useI18n } from "./i18n";

// Official Chinese names for chip vendors. Only vendors whose Chinese name we could
// verify are listed; anything missing (Milk-V, Shenzhen RongDa, QEMU, …) stays as-is,
// because a wrong brand name is worse than no translation.
export const VENDOR_NAMES_ZH = {
  UltraRISC: "超睿科技",
  BOSC: "北京开源芯片研究院",
  ESWIN: "奕斯伟计算",
  SpaceMIT: "进迭时空",
  StarFive: "赛昉科技",
  Sophgo: "算能",
  XuanTie: "玄铁",
  Zhihe: "知合计算",
  Allwinner: "全志科技",
};

export const vendorZhName = (name) => VENDOR_NAMES_ZH[name] ?? null;

// The search box finds a vendor by either script: "赛昉" and "starfive" both match.
export const vendorSearchTerms = (name) => {
  const zh = vendorZhName(name);
  return zh ? [name, zh] : [name];
};

// Chinese first, the brand's English name kept as a quiet suffix. In English, or for
// vendors without a verified Chinese name, this is just the name.
export function VendorName({ name }) {
  const { lang } = useI18n();
  const zh = vendorZhName(name);
  if (lang !== "zh" || !zh) return name;
  return (
    <span className="vname">
      {zh}{" "}
      <span className="v-en" lang="en" translate="no">{name}</span>
    </span>
  );
}
