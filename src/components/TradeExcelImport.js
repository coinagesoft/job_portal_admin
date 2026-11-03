"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Check, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { homepageService } from "../services/homepageService";

const MAX_FILE_MB = 20;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* What each import needs. The button's `kind` prop picks one of these. */
const IMPORTS = {
  trades: {
    buttonLabel: "Import from Excel",
    title: "Import trades & sub-trades",
    description: "Adds sectors, trades and sub-trades. These feed the recruiter registration dropdowns.",
    sheetName: "ALL TRADES",
    columns: ["SECTOR", "TRADE", "CATEGORIES / SUB-TRADES"],
    notes: [
      "The first row is the header and is skipped.",
      "Only new items are added; existing sectors, trades and sub-trades are kept.",
    ],
    warning: "",
    confirmMessage: "",
    submitLabel: "Import trades",
    run: (file) => homepageService.importTradeHierarchy(file),
    formatResult: (res) =>
      `${res?.message || "Import completed."} Sectors added: ${res?.industriesAdded ?? 0}, trades added: ${res?.tradesAdded ?? 0}, sub-trades added: ${res?.subTradesAdded ?? 0}.`,
  },
  credits: {
    buttonLabel: "Import from Excel",
    title: "Import bands & credits per trade",
    description:
      "Sets which band each trade belongs to and the credits a recruiter pays to unlock that trade's candidates.",
    sheetName: "ALL TRADES",
    columns: ["TRADE", "CATEGORIES / SUB-TRADES", "TIER", "CREDITS"],
    notes: [
      "TIER is the band name, for example Band A. CREDITS is its unlock cost, for example 2.",
      "Every row of the same band must use the same CREDITS, and every row of the same trade the same band.",
      "A trade that is not in the system yet is created automatically. Sub-trade values are ignored.",
    ],
    warning:
      "This REPLACES all current bands and trade assignments. Any trade missing from the sheet will have no band, and recruiters cannot unlock its candidates until it is assigned. If the file has an error, nothing is changed.",
    confirmMessage:
      "This will delete ALL existing bands and trade-to-band assignments and rebuild them from the Excel file. Continue?",
    submitLabel: "Replace bands & credits",
    run: (file) => homepageService.importTradeCreditExcel(file),
    formatResult: (res) =>
      `${res?.message || "Import completed."} ${res?.count ?? 0} trade assignments created.`,
  },
};

/**
 * A button that opens an Excel-import dialog.
 *
 *   <ExcelImportButton kind="trades" onImported={reload} />
 *   <ExcelImportButton kind="credits" onImported={reload} />
 *
 * `onImported` runs once an import succeeds, so the section can refresh itself.
 */
export default function ExcelImportButton({ kind, onImported, style, label }) {
  const cfg = IMPORTS[kind];
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    if (busy) return;
    setOpen(false);
    setFile(null);
    setError("");
    setSuccess("");
  };

  // Esc closes the dialog; the page behind it does not scroll while it is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, busy]);

  if (!cfg) return null;

  const handlePick = (event) => {
    setError("");
    setSuccess("");

    const picked = event.target.files?.[0];
    if (!picked) return;

    if (!/\.xlsx$/i.test(picked.name)) {
      setError("Only .xlsx Excel files are supported.");
      clearFile();
      return;
    }
    if (picked.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`The file is larger than ${MAX_FILE_MB} MB.`);
      clearFile();
      return;
    }
    setFile(picked);
  };

  const handleImport = async () => {
    if (!file || busy) return;
    if (cfg.confirmMessage && !window.confirm(cfg.confirmMessage)) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await cfg.run(file);
      setSuccess(cfg.formatResult(response));
      clearFile();
      if (onImported) await onImported(response);
    } catch (err) {
      console.error("Excel import failed:", err);
      setError(err?.message || "The import failed. Nothing was changed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const dialog = open
    ? createPortal(
        <div className="xi-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div className="xi-dialog" role="dialog" aria-modal="true" aria-labelledby="xi-title">
            <div className="xi-head">
              <span className="xi-icon">
                <FileSpreadsheet size={19} />
              </span>
              <div>
                <h4 id="xi-title">{cfg.title}</h4>
                <p>{cfg.description}</p>
              </div>
              <button type="button" className="xi-close" onClick={close} disabled={busy} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="xi-body">
              <div className="xi-format">
                <strong>
                  Sheet name: <code>{cfg.sheetName}</code>
                </strong>
                <div className="xi-cols">
                  {cfg.columns.map((c) => (
                    <code key={c}>{c}</code>
                  ))}
                </div>
                <ul>
                  {cfg.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>

              {cfg.warning && (
                <div className="xi-msg xi-warn" role="note">
                  <AlertTriangle size={16} />
                  <span>{cfg.warning}</span>
                </div>
              )}

              <div className="xi-pick">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handlePick}
                  disabled={busy}
                  aria-label={`Choose Excel file for ${cfg.title}`}
                />
                {file && (
                  <span className="xi-file">
                    {file.name} · {formatSize(file.size)}
                    <button type="button" onClick={clearFile} disabled={busy} aria-label="Remove file">
                      <X size={13} />
                    </button>
                  </span>
                )}
              </div>

              {error && (
                <div className="xi-msg xi-error" role="alert">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="xi-msg xi-success" role="status">
                  <Check size={16} />
                  <span>{success}</span>
                </div>
              )}
            </div>

            <div className="xi-actions">
              <button type="button" className="xi-ghost" onClick={close} disabled={busy}>
                {success ? "Done" : "Cancel"}
              </button>
              <button type="button" className="xi-primary" onClick={handleImport} disabled={!file || busy}>
                {busy ? (
                  <>
                    <Loader2 size={14} className="xi-spin" />
                    Importing…
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    {cfg.submitLabel}
                  </>
                )}
              </button>
            </div>
          </div>

          <style jsx>{`
            .xi-overlay { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; padding: 20px; background: rgba(23, 43, 96, .45); }
            .xi-dialog { width: min(640px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 13px; background: #fff; color: #172b60; box-shadow: 0 24px 60px rgba(23, 43, 96, .28); }
            .xi-head { padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
            .xi-head h4 { margin: 0 0 4px; color: #172b60; font-size: 18px; font-weight: 800; }
            .xi-head p { margin: 0; color: #66789c; font-size: 12px; }
            .xi-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; }
            .xi-close { width: 30px; height: 30px; display: grid; place-items: center; border: 0; border-radius: 7px; background: transparent; color: #66789c; cursor: pointer; }
            .xi-close:hover:not(:disabled) { background: #f1f4fa; }

            .xi-body { padding: 18px 21px; display: grid; gap: 14px; }
            .xi-format { display: grid; gap: 8px; padding: 12px 14px; border: 1px dashed #d6e0ee; border-radius: 9px; background: #f8faff; font-size: 12px; color: #45577f; }
            .xi-format ul { margin: 0; padding-left: 18px; display: grid; gap: 3px; }
            .xi-cols { display: flex; flex-wrap: wrap; gap: 6px; }
            .xi-format code { padding: 2px 7px; border-radius: 5px; background: #fff; border: 1px solid #e1e8f3; color: #172b60; font-size: 11px; font-weight: 700; }

            .xi-pick { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
            .xi-pick input[type="file"] { font-size: 13px; color: #45577f; max-width: 100%; }
            .xi-file { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 20px; background: #edf2fb; color: #31456f; font-size: 12px; font-weight: 600; }
            .xi-file button { display: grid; place-items: center; border: 0; background: transparent; color: #66789c; cursor: pointer; padding: 0; }

            .xi-msg { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; line-height: 1.45; }
            .xi-error { color: #a83232; background: #fff0f0; }
            .xi-success { color: #247343; background: #edf9f0; }
            .xi-warn { color: #8a5a00; background: #fff6e0; }

            .xi-actions { padding: 14px 21px 18px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #edf1f6; }
            .xi-primary, .xi-ghost { min-height: 38px; padding: 8px 16px; border-radius: 7px; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; cursor: pointer; }
            .xi-primary { border: 0; background: #ffa300; color: #fff; }
            .xi-primary:hover:not(:disabled) { background: #e08f00; }
            .xi-ghost { border: 1px solid #d6e0ee; background: #fff; color: #45577f; }
            .xi-ghost:hover:not(:disabled) { background: #f8faff; }
            .xi-primary:disabled, .xi-ghost:disabled { opacity: .55; cursor: not-allowed; }
            .xi-primary:focus-visible, .xi-ghost:focus-visible, .xi-close:focus-visible { outline: 2px solid #172b60; outline-offset: 2px; }

            @keyframes xi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            :global(.xi-spin) { animation: xi-spin 1s linear infinite; }
            @media (prefers-reduced-motion: reduce) { :global(.xi-spin) { animation-duration: 2.5s; } }
          `}</style>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ ...triggerStyle, ...style }}
      >
        <Upload size={14} />
        {label || cfg.buttonLabel}
      </button>
      {dialog}
    </>
  );
}

// Default (secondary) button look; hosts can override via the `style` prop.
const triggerStyle = {
  minHeight: 36,
  padding: "8px 14px",
  border: "1px solid #d6e0ee",
  borderRadius: 7,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#fff",
  color: "#45577f",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  whiteSpace: "nowrap",
};