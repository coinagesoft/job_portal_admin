"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Check, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { homepageService } from "../services/homepageService";

const MAX_FILE_MB = 20;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* One upload card: pick a .xlsx, confirm (optional), upload, show the result. */
function ImportCard({
  step,
  title,
  description,
  sheetName,
  columns,
  notes,
  warning,
  confirmMessage,
  buttonLabel,
  onImport,
  formatResult,
}) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

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
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await onImport(file);
      setSuccess(formatResult(response));
      clearFile();
    } catch (err) {
      console.error("Excel import failed:", err);
      setError(err?.message || "The import failed. Nothing was changed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ti-card">
      <div className="ti-heading">
        <span className="ti-icon">
          <FileSpreadsheet size={19} />
        </span>
        <div>
          <span className="ti-step">{step}</span>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>

      <div className="ti-body">
        <div className="ti-format">
          <strong>
            Sheet name: <code>{sheetName}</code>
          </strong>
          <div className="ti-cols">
            {columns.map((c) => (
              <code key={c}>{c}</code>
            ))}
          </div>
          {notes.length > 0 && (
            <ul>
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        {warning && (
          <div className="ti-msg ti-warn" role="note">
            <AlertTriangle size={16} />
            <span>{warning}</span>
          </div>
        )}

        <div className="ti-pick">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handlePick}
            disabled={busy}
            aria-label={`Choose Excel file for ${title}`}
          />
          {file && (
            <span className="ti-file">
              {file.name} · {formatSize(file.size)}
              <button type="button" onClick={clearFile} disabled={busy} aria-label="Remove file">
                <X size={13} />
              </button>
            </span>
          )}
        </div>

        {error && (
          <div className="ti-msg ti-error" role="alert">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="ti-msg ti-success" role="status">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        <div className="ti-actions">
          <button type="button" className="ti-primary" onClick={handleImport} disabled={!file || busy}>
            {busy ? (
              <>
                <Loader2 size={14} className="ti-spin" />
                Importing…
              </>
            ) : (
              <>
                <Upload size={14} />
                {buttonLabel}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .ti-card { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); color: #172b60; }
        .ti-heading { padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
        .ti-heading h4 { margin: 2px 0 4px; color: #172b60; font-size: 20px; font-weight: 800; }
        .ti-heading p { margin: 0; color: #66789c; font-size: 12px; }
        .ti-step { color: #f39b00; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .ti-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; }

        .ti-body { padding: 18px 21px 21px; display: grid; gap: 14px; }
        .ti-format { display: grid; gap: 8px; padding: 12px 14px; border: 1px dashed #d6e0ee; border-radius: 9px; background: #f8faff; font-size: 12px; color: #45577f; }
        .ti-format ul { margin: 0; padding-left: 18px; display: grid; gap: 3px; }
        .ti-cols { display: flex; flex-wrap: wrap; gap: 6px; }
        .ti-cols code, .ti-format code { padding: 2px 7px; border-radius: 5px; background: #fff; border: 1px solid #e1e8f3; color: #172b60; font-size: 11px; font-weight: 700; }

        .ti-pick { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .ti-pick input[type="file"] { font-size: 13px; color: #45577f; max-width: 100%; }
        .ti-file { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 20px; background: #edf2fb; color: #31456f; font-size: 12px; font-weight: 600; }
        .ti-file button { display: grid; place-items: center; border: 0; background: transparent; color: #66789c; cursor: pointer; padding: 0; }

        .ti-msg { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; line-height: 1.45; }
        .ti-msg :global(svg) { flex: 0 0 auto; margin-top: 1px; }
        .ti-error { color: #a83232; background: #fff0f0; }
        .ti-success { color: #247343; background: #edf9f0; }
        .ti-warn { color: #8a5a00; background: #fff6e0; }

        .ti-actions { display: flex; justify-content: flex-end; }
        .ti-primary { min-height: 38px; padding: 8px 16px; border: 0; border-radius: 7px; display: inline-flex; align-items: center; gap: 7px; background: #ffa300; color: #fff; font-size: 12px; font-weight: 800; cursor: pointer; }
        .ti-primary:hover:not(:disabled) { background: #e08f00; }
        .ti-primary:disabled { opacity: .55; cursor: not-allowed; }
        .ti-primary:focus-visible { outline: 2px solid #172b60; outline-offset: 2px; }

        @keyframes ti-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        :global(.ti-spin) { animation: ti-spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { :global(.ti-spin) { animation-duration: 2.5s; } }
      `}</style>
    </section>
  );
}

export default function TradeExcelImport() {
  return (
    <div style={{ display: "grid", gap: 19 }}>
      <ImportCard
        step="Step 1"
        title="Import trades & sub-trades"
        description="Adds sectors, trades and sub-trades. These feed the recruiter registration dropdowns."
        sheetName="ALL TRADES"
        columns={["SECTOR", "TRADE", "CATEGORIES / SUB-TRADES"]}
        notes={[
          "The first row is the header and is skipped.",
          "Only new items are added; existing sectors, trades and sub-trades are kept.",
        ]}
        buttonLabel="Import trades"
        onImport={homepageService.importTradeHierarchy}
        formatResult={(res) =>
          `${res?.message || "Import completed."} Sectors added: ${res?.industriesAdded ?? 0}, trades added: ${res?.tradesAdded ?? 0}, sub-trades added: ${res?.subTradesAdded ?? 0}.`
        }
      />

      <ImportCard
        step="Step 2"
        title="Import bands & credits per trade"
        description="Sets which band each trade belongs to and the credits a recruiter pays to unlock that trade's candidates."
        sheetName="ALL TRADES"
        columns={["TRADE", "CATEGORIES / SUB-TRADES", "TIER", "CREDITS"]}
        notes={[
          "TIER is the band name, for example Band A. CREDITS is its unlock cost, for example 2.",
          "Every row of the same band must use the same CREDITS, and every row of the same trade the same band.",
          "A trade that is not in the system yet is created automatically. Sub-trade values are ignored.",
        ]}
        warning="This REPLACES all current bands and trade assignments. Any trade missing from the sheet will have no band, and recruiters cannot unlock its candidates until it is assigned. If the file has an error, nothing is changed."
        confirmMessage="This will delete ALL existing bands and trade-to-band assignments and rebuild them from the Excel file. Continue?"
        buttonLabel="Replace bands & credits"
        onImport={homepageService.importTradeCreditExcel}
        formatResult={(res) =>
          `${res?.message || "Import completed."} ${res?.count ?? 0} trade assignments created. Open Tier Management to review the bands.`
        }
      />
    </div>
  );
}