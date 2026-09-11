import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
    __amargosaVLibrasInitialized?: boolean;
  }
}

const scriptId = "vlibras-plugin-script";

export function VLibras() {
  useEffect(() => {
    const initialize = () => {
      if (!window.VLibras || window.__amargosaVLibrasInitialized) return;
      window.__amargosaVLibrasInitialized = true;
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    };

    const currentScript = window.document.getElementById(scriptId) as HTMLScriptElement | null;
    if (currentScript) {
      if (window.VLibras) initialize();
      else currentScript.addEventListener("load", initialize, { once: true });
      return;
    }

    const script = window.document.createElement("script");
    script.id = scriptId;
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.addEventListener("load", initialize, { once: true });
    window.document.body.appendChild(script);
  }, []);

  return (
    <div {...{ vw: "true" }} className="enabled">
      <div {...{ "vw-access-button": "true" }} className="active" />
      <div {...{ "vw-plugin-wrapper": "true" }}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
