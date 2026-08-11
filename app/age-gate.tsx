"use client";

import { useState } from "react";

export default function AgeGate() {
  const [confirmed, setConfirmed] = useState(false);

  function enterSite() {
    setConfirmed(true);
  }

  if (confirmed) return null;

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate-panel">
        <p className="kicker">閲覧前の確認</p>
        <h2 id="age-gate-title">18歳以上ですか</h2>
        <p>
          このサイトは、性的な話題を含む一般情報を扱います。18歳未満の方、またはこの話題を読むことに不安がある方は閲覧を控えてください。
        </p>
        <div className="age-gate-actions">
          <button className="button" type="button" onClick={enterSite}>
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
