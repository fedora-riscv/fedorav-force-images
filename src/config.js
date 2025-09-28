import raw from "raw.macro";

export const apiUrl = 'https://api.fedoravforce.org/stats/';

export const imageMap = {
  'BeagleV Ahead': '/images/beaglev-ahead.webp',
  'Duo 256M': '/images/duo-256m.webp',
  'Duo-S': '/images/duo-s.webp',
  'Duo': '/images/duo.webp',
  'Jupiter': '/images/jupiter.webp',
  'LicheePi 3A': '/images/lichee-pi-3a.webp',
  'LicheePi 4A': '/images/lichee-pi-4a.webp',
  'LicheePi 5A': '/images/lichee-pi-5a.webp',
  'LicheeRV Nano': '/images/licheerv-nano.webp',
  'Mars': '/images/mars.webp',
  'Meles': '/images/meles.webp',
  'Muse book': '/images/musebook.webp',
  'Pioneer': '/images/pionner.webp',
  'DC-ROMA II': '/images/roma-ii.webp',
  'VisionFive V2': '/images/vision-five-2.webp',
  'EIC7700-EVB': '/images/eic7700fg-evb.webp',
  'RuyiBook': '/images/ruyibook.webp',
  'NANHU_V2_DEV_BOARD V01': '/images/nanhu-v2.webp',
  'DC-ROMA I': '/images/roma.webp',
  'Oasis': '/images/sg2380.webp',
  'Megrez': '/images/megrez.webp',
  'MUSE N1': '/images/muse-n1.webp',
  'Banana Pi BPI-F3': '/images/banana-pi-bpi-f3.webp',
  'QEMU': '/images/qemu.webp',
  'HiFive Premier P550': '/images/hifive-premier-p550.avif',
  'Unmatched': '/images/unmatched.avif',
  'Framework': '/images/framework.webp',
  'Titan': '/images/titan.webp',
  'Taurus': '/images/taurus.webp',
  'UR-DP1000-EVB': '/images/ur-dp1000-evb.webp',
};

export const mdMap = {
  'Jupiter': raw('./md/jupiter.md'),
  'EIC7700-EVB': raw('./md/eswin.md'),
  'Megrez': raw('./md/eswin.md'),
  'HiFive Premier P550': raw('./md/eswin.md'),
  'LicheePi 4A': raw('./md/licheepi4a.md'),
  'QEMU': raw('./md/qemu.md'),
};

export const testReportMap = {
  'DC-ROMA I': 'https://blog.fedoravforce.com/test-reports/roma-i/',
  'DC-ROMA II': 'https://blog.fedoravforce.com/test-reports/roma-ii/',
};
