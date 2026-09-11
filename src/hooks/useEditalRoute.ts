import { useEffect, useState } from "react";

const routePattern = /^#\/editais\/([^/?#]+)/;
type EditalOrigin = "home" | "all" | "accessibility";

function readEditalOrigin(): EditalOrigin {
  if (window.history.state?.editalOrigin === "accessibility") return "accessibility";
  return window.history.state?.editalOrigin === "home" ? "home" : "all";
}

function readRoute() {
  const match = window.location.hash.match(routePattern);
  if (match) return { editalId: decodeURIComponent(match[1]), showAbout: false, showAccessibility: false, showAllEditais: false };
  return {
    editalId: null,
    showAbout: /^#\/sobre\/?$/.test(window.location.hash),
    showAccessibility: /^#\/acessibilidade\/?$/.test(window.location.hash),
    showAllEditais: /^#\/editais\/?$/.test(window.location.hash),
  };
}

export function useEditalRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const updateRoute = () => setRoute(readRoute());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const openEdital = (id: string) => {
    const currentRoute = readRoute();
    const editalOrigin: EditalOrigin = currentRoute.editalId
      ? readEditalOrigin()
      : currentRoute.showAccessibility ? "accessibility" : currentRoute.showAllEditais ? "all" : "home";

    window.location.hash = `/editais/${encodeURIComponent(id)}`;
    window.history.replaceState({ ...window.history.state, editalOrigin }, "");
  };

  const closeEdital = () => {
    const origin = readEditalOrigin();
    window.location.hash = origin === "home" ? "editais" : origin === "accessibility" ? "/acessibilidade" : "/editais";
  };

  const openAllEditais = () => {
    window.location.hash = "/editais";
  };

  const closeAllEditais = () => {
    window.location.hash = "editais";
  };

  const closeAbout = () => {
    window.location.hash = "inicio";
  };

  const closeAccessibility = () => {
    window.location.hash = "inicio";
  };

  return {
    closeAccessibility,
    closeAbout,
    closeAllEditais,
    closeEdital,
    editalId: route.editalId,
    openAllEditais,
    openEdital,
    showAccessibility: route.showAccessibility,
    showAbout: route.showAbout,
    showAllEditais: route.showAllEditais,
  };
}
