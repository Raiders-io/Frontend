import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    window.location.href = "/terms.html";
  }, []);

  return null;
}
