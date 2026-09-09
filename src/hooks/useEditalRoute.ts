import { useEffect, useState } from "react";

const routePattern = /^#\/editais\/([^/?#]+)/;
type EditalOrigin = "home" | "all";

function readEditalOrigin(): EditalOrigin {
  return window.history.state?.editalOrigin === "home" ? "home" : "all";
}

function readRoute() {
  const match = window.location.hash.match(routePattern);
  if (match) return { editalId: decodeURIComponent(match[1]), showAllEditais: false };
  return { editalId: null, showAllEditais: /^#\/editais\/?$/.test(window.location.hash) };
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
      : currentRoute.showAllEditais ? "all" : "home";

    window.location.hash = `/editais/${encodeURIComponent(id)}`;
    window.history.replaceState({ ...window.history.state, editalOrigin }, "");
  };

  const closeEdital = () => {
    window.location.hash = readEditalOrigin() === "home" ? "editais" : "/editais";
  };

  const openAllEditais = () => {
    window.location.hash = "/editais";
  };

  const closeAllEditais = () => {
    window.location.hash = "editais";
  };

  return { closeAllEditais, closeEdital, editalId: route.editalId, openAllEditais, openEdital, showAllEditais: route.showAllEditais };
}
