"use client";

import { useEffect, useRef, useState } from "react";

const focusableSelector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const storageKey = "nouiki-age-confirmed";

function hasConfirmedAge() {
  try {
    return window.localStorage.getItem(storageKey) === "yes";
  } catch {
    return false;
  }
}

function storeAgeConfirmation() {
  try {
    window.localStorage.setItem(storageKey, "yes");
  } catch {
    // Some private browser modes block storage. The click should still enter the site.
  }
}

export default function AgeGate() {
  const [confirmed, setConfirmed] = useState(() => {
    if (typeof window === "undefined") return false;
    return hasConfirmedAge();
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmed) return;

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

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", keepFocusInside);
    enterButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", keepFocusInside);
    };
  }, [confirmed]);

  function enterSite() {
    storeAgeConfirmation();
    setConfirmed(true);
  }

  if (confirmed) return null;

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate-panel" ref={panelRef}>
        <p className="kicker">18歳以上向け</p>
        <h2 id="age-gate-title">18歳以上ですか</h2>
        <p>この先には、成人向けの性に関する内容があります。18歳未満の方は閲覧できません。</p>
        <div className="age-gate-actions">
          <button
            className="button"
            type="button"
            onClick={enterSite}
            onPointerUp={enterSite}
            ref={enterButtonRef}
          >
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
