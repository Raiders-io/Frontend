import { useEffect } from "react";

export default function CookiesPage() {
  useEffect(() => {
    window.location.href = "/cookies.html";
  }, []);

  return null;
}
