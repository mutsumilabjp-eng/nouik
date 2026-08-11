"use client";

import { useEffect, useRef, useState } from "react";

const focusableSelector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function AgeGate() {
  const [confirmed, setConfirmed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const shell = document.getElementById("site-shell");
    if (!shell || confirmed) return;

    function keepFocusInside(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => !element.hasAttribute("disabled"),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    shell.setAttribute("inert", "");
    shell.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", keepFocusInside);
    enterButtonRef.current?.focus();

    return () => {
      shell.removeAttribute("inert");
      shell.removeAttribute("aria-hidden");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", keepFocusInside);
    };
  }, [confirmed]);

  function enterSite() {
    setConfirmed(true);
  }

  if (confirmed) return null;

  return (
    <div
      className="age-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="age-gate-panel" ref={panelRef}>
        <p className="kicker">18歳以上向け</p>
        <h2 id="age-gate-title">18歳以上ですか</h2>
        <p>
          このサイトは、性的な話題を含みます。18歳未満の方、またはこの話題を読むことに不安がある方は閲覧を控えてください。
        </p>
        <div className="age-gate-actions">
          <button className="button" type="button" onClick={enterSite} ref={enterButtonRef}>
            18歳以上です
          </button>
          <a className="text-link" href="https://www.google.com/">
            閲覧しない
          </a>
        </div>
      </div>
    </div>
  );
}
