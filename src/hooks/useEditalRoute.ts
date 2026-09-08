import { useEffect, useState } from "react";

const routePattern = /^#\/editais\/([^/?#]+)/;

function readEditalId() {
  const match = window.location.hash.match(routePattern);
  return match ? decodeURIComponent(match[1]) : null;
}

export function useEditalRoute() {
  const [editalId, setEditalId] = useState(readEditalId);

  useEffect(() => {
    const updateRoute = () => setEditalId(readEditalId());
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  const openEdital = (id: string) => {
    window.location.hash = `/editais/${encodeURIComponent(id)}`;
  };

  const closeEdital = () => {
    window.location.hash = "editais";
  };

  return { closeEdital, editalId, openEdital };
}
