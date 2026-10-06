import { useEffect, useState } from "react";

const routePattern = /^#\/editais\/([^/?#]+)/;
type EditalOrigin = "home" | "all" | "accessibility";

function readEditalOrigin(): EditalOrigin {
  if (window.history.state?.editalOrigin === "accessibility") return "accessibility";
  return window.history.state?.editalOrigin === "home" ? "home" : "all";
}

function readRoute() {
  const match = window.location.hash.match(routePattern);
  if (match) {
    const query = window.location.hash.split("?", 2)[1] ?? "";
    return {
      editalId: decodeURIComponent(match[1]),
      documentId: new URLSearchParams(query).get("document") ?? "main",
      showAbout: false,
      showAccessibility: false,
      showAllEditais: false,
    };
  }
  return {
    editalId: null,
    documentId: "main",
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
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  const closeEdital = () => {
    const origin = readEditalOrigin();
    window.location.hash = origin === "home" ? "editais" : origin === "accessibility" ? "/acessibilidade" : "/editais";
  };

  const openDocument = (documentId: string) => {
    const { editalId } = readRoute();
    if (!editalId) return;

    const query = documentId === "main"
      ? ""
      : `?${new URLSearchParams({ document: documentId })}`;
    window.location.hash = `/editais/${encodeURIComponent(editalId)}${query}`;
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
    documentId: route.documentId,
    editalId: route.editalId,
    openAllEditais,
    openDocument,
    openEdital,
    showAccessibility: route.showAccessibility,
    showAbout: route.showAbout,
    showAllEditais: route.showAllEditais,
  };
}
