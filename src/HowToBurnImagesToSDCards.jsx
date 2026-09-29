import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Download a Fedora image",
    text: "Pick your board on this site and download the latest Fedora image. GNOME, KDE Plasma and Xfce builds are available depending on the board.",
    images: ["/images/burn-images-to-sd-01.webp"],
  },
  {
    title: "Get balenaEtcher",
    text: (
      <>
        Download and install{" "}
        <a href="https://etcher.balena.io" target="_blank" rel="noopener noreferrer">balenaEtcher</a>, a
        cross-platform tool for flashing OS images to SD cards and USB drives.
      </>
    ),
    images: ["/images/burn-images-to-sd-02.webp"],
  },
  {
    title: "Select the image file",
    text: "Open balenaEtcher, click “Flash from file” and choose the Fedora image you downloaded.",
    images: ["/images/burn-images-to-sd-03.webp", "/images/burn-images-to-sd-04.webp"],
  },
  {
    title: "Choose the SD card",
    text: "Insert your SD card and click “Select target” to choose it as the destination device.",
    images: ["/images/burn-images-to-sd-05.webp", "/images/burn-images-to-sd-06.webp"],
  },
  {
    title: "Flash the image",
    text: "Click “Flash” to start writing the image to the SD card. This takes several minutes.",
    images: ["/images/burn-images-to-sd-07.webp"],
  },
];

export default function HowToBurnImagesToSDCards() {
  return (
    <div className="wrap view">
      <div className="guide-h">
        <div className="eyebrow">Install guide</div>
        <h1>Flash Fedora to an SD card.</h1>
        <p>Five steps with balenaEtcher. Works on Linux, macOS and Windows.</p>
      </div>
      <div className="prep">
        <div>
          <h3>You need</h3>
          <ul>
            <li>An SD card, 8 GB or larger</li>
            <li>A computer with an SD card reader</li>
            <li>An internet connection</li>
            <li>balenaEtcher</li>
          </ul>
        </div>
        <div className="warn">
          <h3>Before you start</h3>
          <ul>
            <li>Everything on the SD card will be erased</li>
            <li>Flashing can take 10 to 30 minutes</li>
            <li>Do not remove the card while flashing</li>
            <li>Check the MD5 checksum when one is listed</li>
          </ul>
        </div>
      </div>
      <ol className="steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <div className="tx">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
            <div className={`shots${step.images.length > 1 ? " two" : ""}`}>
              {step.images.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </li>
        ))}
        <li style={{ display: "block" }}>
          <div className="done">
            <h3>
              Boot it. <span className="v">You’re done.</span>
            </h3>
            <Link className="btn btn-gold" to="/" viewTransition>Browse boards →</Link>
          </div>
        </li>
      </ol>
    </div>
  );
}
