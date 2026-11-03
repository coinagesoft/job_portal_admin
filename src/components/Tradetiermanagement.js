"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, Layers, Loader2, Plus, Save, X } from "lucide-react";
import { homepageService } from "../services/homepageService";
import ExcelImportButton from "./TradeExcelImport";

// Supports a direct array or { success, count, data: [...] } (also nested).
const getArray = (response) => {
  let result = response;
  let depth = 0;
  while (
    result &&
    !Array.isArray(result) &&
    typeof result === "object" &&
    result.data !== undefined &&
    depth < 5
  ) {
    result = result.data;
    depth++;
  }
  return Array.isArray(result) ? result : [];
};

// Same trade name (ignoring case and extra spaces) = same trade.
const norm = (value) => String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

export default function TradeTierManagement() {
  const [tiers, setTiers] = useState([]);
  const [tierName, setTierName] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [unlockCredits, setUnlockCredits] = useState("");
  const [editingTierId, setEditingTierId] = useState(null);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [savingTier, setSavingTier] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const nameInputRef = useRef(null);

  // Band -> trades view
  const [trades, setTrades] = useState([]); // [{ key, name, id }]
  const [mappings, setMappings] = useState([]); // main-trade mappings only
  const [pick, setPick] = useState({}); // tierId -> selected trade key
  const [assigningTierId, setAssigningTierId] = useState(null);

  const loadTiers = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoadingTiers(true);

    try {
      const response = await homepageService.getTradeCreditTiers();
      setTiers(
        [...getArray(response)].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      );
    } catch (error) {
      console.error("Failed to load tiers:", error);
      setErrorMessage("Could not load tiers. Try refreshing.");
    } finally {
      setLoadingTiers(false);
    }
  }, []);

  const loadTradeData = useCallback(async () => {
    try {
      const [tradeRes, mappingRes] = await Promise.all([
        homepageService.getTradeCategories(),
        homepageService.getTradeCreditMappings(),
      ]);

      // One entry per trade name (duplicate categories share a name).
      const byKey = new Map();
      getArray(tradeRes)
        .filter((t) => t?.isActive !== false && t?.IsActive !== false)
        .forEach((t) => {
          const name = String(t?.name ?? t?.Name ?? "").trim();
          const id = t?.id ?? t?.Id ?? t?.tradeCategoryId ?? t?.TradeCategoryId;
          const key = norm(name);
          if (key && id && !byKey.has(key)) byKey.set(key, { key, name, id });
        });

      setTrades([...byKey.values()].sort((a, b) => a.name.localeCompare(b.name)));
      setMappings(
        getArray(mappingRes).filter(
          (m) => (m?.subTradeId ?? m?.SubTradeId ?? null) == null && m?.isActive !== false
        )
      );
    } catch (error) {
      console.error("Failed to load trades:", error);
      setErrorMessage("Could not load trades. Try refreshing.");
    }
  }, []);

  useEffect(() => {
    loadTiers();
    loadTradeData();
  }, [loadTiers, loadTradeData]);

  // trade key -> tierId it currently belongs to
  const tierByTrade = useMemo(() => {
    const map = new Map();
    mappings.forEach((m) => map.set(norm(m.tradeName ?? m.TradeName), m.tierId ?? m.TierId));
    return map;
  }, [mappings]);

  const tradesInTier = (tierId) => trades.filter((t) => tierByTrade.get(t.key) === tierId);
  const unassignedCount = trades.filter((t) => !tierByTrade.get(t.key)).length;

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const activeCount = tiers.filter((tier) => tier.isActive).length;
  const nextOrder = tiers.length ? Math.max(...tiers.map((t) => t.displayOrder ?? 0)) + 1 : 1;
  const busy = savingTier || togglingId !== null;

  const resetForm = () => {
    setTierName("");
    setDisplayOrder("");
    setUnlockCredits("");
    setEditingTierId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = tierName.trim();
    const order = Number(displayOrder);
    const credits = Number(unlockCredits);

    if (!name) {
      setErrorMessage("Enter a tier name.");
      return;
    }

    const duplicate = tiers.some(
      (tier) =>
        tier.tierId !== editingTierId &&
        String(tier.tierName).trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      setErrorMessage(`A tier named "${name}" already exists.`);
      return;
    }

    if (displayOrder === "" || !Number.isInteger(order) || order < 0) {
      setErrorMessage("Display order must be a whole number, 0 or higher.");
      return;
    }

    if (unlockCredits === "" || !Number.isInteger(credits) || credits <= 0) {
      setErrorMessage("Unlock credits must be a whole number greater than 0.");
      return;
    }

    setSavingTier(true);

    try {
      if (editingTierId) {
        await homepageService.updateTradeCreditTier(editingTierId, {
          tierName: name,
          displayOrder: order,
          unlockCredits: credits,
        });
        setSuccessMessage(`Updated ${name}.`);
      } else {
        await homepageService.createTradeCreditTier({
          tierName: name,
          displayOrder: order,
          unlockCredits: credits,
        });
        setSuccessMessage(`Created ${name}.`);
      }

      resetForm();
      await loadTiers({ silent: true });
    } catch (error) {
      console.error("Failed to save tier:", error);
      setErrorMessage(error?.message || "Could not save the tier. Try again.");
    } finally {
      setSavingTier(false);
    }
  };

  const handleEdit = (tier) => {
    setEditingTierId(tier.tierId);
    setTierName(tier.tierName);
    setDisplayOrder(String(tier.displayOrder));
    setUnlockCredits(String(tier.unlockCredits ?? ""));
    setErrorMessage("");
    setSuccessMessage("");
    nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    nameInputRef.current?.focus({ preventScroll: true });
  };

  const handleAddTrade = async (tier) => {
    const trade = trades.find((t) => t.key === pick[tier.tierId]);
    if (!trade) return;

    const currentTierId = tierByTrade.get(trade.key);
    const currentTier = tiers.find((t) => t.tierId === currentTierId);

    if (
      currentTier &&
      !window.confirm(
        `${trade.name} is currently in ${currentTier.tierName} (${currentTier.unlockCredits} credits). Move it to ${tier.tierName} (${tier.unlockCredits} credits)?`
      )
    ) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setAssigningTierId(tier.tierId);

    try {
      await homepageService.saveMainTradeCreditMapping(trade.id, { tierId: tier.tierId });
      setSuccessMessage(`${trade.name} added to ${tier.tierName}.`);
      setPick((current) => ({ ...current, [tier.tierId]: "" }));
      await loadTradeData();
    } catch (error) {
      console.error("Failed to assign trade:", error);
      setErrorMessage(error?.message || "Could not add the trade to this band. Try again.");
    } finally {
      setAssigningTierId(null);
    }
  };

  const handleToggle = async (tier) => {
    setErrorMessage("");
    setSuccessMessage("");

    const affected = tradesInTier(tier.tierId).length;

    if (
      tier.isActive &&
      !window.confirm(
        affected > 0
          ? `Deactivate ${tier.tierName}? ${affected} trade${affected === 1 ? " is" : "s are"} in this band, and recruiters will not be able to unlock those candidates until the trades are moved to another band.`
          : `Deactivate ${tier.tierName}? It will no longer appear when assigning credits to trades.`
      )
    ) {
      return;
    }

    setTogglingId(tier.tierId);
    try {
      await homepageService.toggleTradeCreditTier(tier.tierId);
      setSuccessMessage(
        tier.isActive ? `Deactivated ${tier.tierName}.` : `Activated ${tier.tierName}.`
      );
      if (editingTierId === tier.tierId) resetForm();
      await loadTiers({ silent: true });
    } catch (error) {
      console.error("Failed to toggle tier:", error);
      setErrorMessage(error?.message || "Could not change the tier status. Try again.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="tm">
      {/* ------------------------------ form card ------------------------------ */}
      <section className={`tm-card ${editingTierId ? "is-editing" : ""}`}>
        <div className="tm-heading">
          <span className="tm-icon">
            <Layers size={19} />
          </span>
          <div>
            <h4>{editingTierId ? "Edit tier" : "Create tier"}</h4>
            <p>
              {editingTierId
                ? "Change the name, position or credits. Trades already using this tier keep it and get the new credits."
                : "Each band (tier) has one credit cost. Add trades to a band below; unlocking a candidate in those trades deducts the band's credits."}
            </p>
          </div>
        </div>

        <form className="tm-form" onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Escape" && editingTierId && resetForm()}>
          <div className="tm-grid">
            <label>
              Tier name
              <input
                ref={nameInputRef}
                value={tierName}
                onChange={(event) => setTierName(event.target.value)}
                placeholder="e.g. Band A"
                maxLength={100}
                disabled={savingTier}
              />
            </label>

            <label>
              Display order
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={displayOrder}
                onChange={(event) => setDisplayOrder(event.target.value)}
                placeholder={`e.g. ${nextOrder}`}
                disabled={savingTier}
              />
            </label>

            <label>
              Unlock credits
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={unlockCredits}
                onChange={(event) => setUnlockCredits(event.target.value)}
                placeholder="e.g. 2"
                disabled={savingTier}
              />
            </label>
          </div>

          {errorMessage && (
            <div className="tm-msg tm-error" role="alert">
              <AlertTriangle size={16} />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="tm-msg tm-success" role="status">
              <Check size={16} />
              {successMessage}
            </div>
          )}

          <div className="tm-actions">
            {editingTierId && (
              <button type="button" className="tm-ghost" onClick={resetForm} disabled={savingTier}>
                <X size={14} />
                Cancel
              </button>
            )}

            <button type="submit" className="tm-primary" disabled={savingTier}>
              {savingTier ? (
                <>
                  <Loader2 size={14} className="tm-spin" />
                  Saving
                </>
              ) : editingTierId ? (
                <>
                  <Save size={14} />
                  Update tier
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Create tier
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ------------------------------ list card ------------------------------ */}
      <section className="tm-card">
        <div className="tm-heading">
          <span className="tm-icon">
            <Layers size={19} />
          </span>
          <div>
            <h4>Existing tiers</h4>
            <p>
              {tiers.length} tier{tiers.length === 1 ? "" : "s"}, {activeCount} active
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <ExcelImportButton
              kind="credits"
              label="Import bands from Excel"
              onImported={() => Promise.all([loadTiers({ silent: true }), loadTradeData()])}
            />
            <button
              type="button"
              className="tm-ghost"
              onClick={() => loadTiers()}
              disabled={loadingTiers || busy}
            >
              <Loader2 size={14} className={loadingTiers ? "tm-spin" : "tm-idle"} />
              Refresh
            </button>
          </div>
        </div>

        {loadingTiers ? (
          <div className="tm-empty">
            <Loader2 size={22} className="tm-spin" />
            Loading tiers...
          </div>
        ) : tiers.length === 0 ? (
          <div className="tm-empty">No tiers yet. Create your first tier above.</div>
        ) : (
          <div className="tm-table-wrap">
            <table className="tm-table">
              <thead>
                <tr>
                  <th>Tier name</th>
                  <th>Display order</th>
                  <th>Unlock credits</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {tiers.map((tier) => (
                  <tr
                    key={tier.tierId}
                    className={[
                      tier.isActive ? "" : "is-inactive",
                      editingTierId === tier.tierId ? "is-editing" : "",
                    ].join(" ")}
                  >
                    <td className="tm-name">{tier.tierName}</td>
                    <td>{tier.displayOrder}</td>
                    <td>{tier.unlockCredits}</td>
                    <td>
                      <span className={`tm-badge ${tier.isActive ? "active" : "inactive"}`}>
                        {tier.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="tm-row-actions">
                        <button
                          type="button"
                          className="tm-ghost tm-small"
                          onClick={() => handleEdit(tier)}
                          disabled={busy}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={`tm-small ${tier.isActive ? "tm-danger" : "tm-ok"}`}
                          onClick={() => handleToggle(tier)}
                          disabled={busy}
                        >
                          {togglingId === tier.tierId ? (
                            <Loader2 size={12} className="tm-spin" />
                          ) : null}
                          {tier.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* --------------------------- trades per band --------------------------- */}
      <section className="tm-card">
        <div className="tm-heading">
          <span className="tm-icon">
            <Layers size={19} />
          </span>
          <div>
            <h4>Trades in each band</h4>
            <p>
              {unassignedCount > 0
                ? `${unassignedCount} trade${unassignedCount === 1 ? " has" : "s have"} no band yet, so recruiters cannot unlock those candidates.`
                : "Every trade has a band."}
            </p>
          </div>
        </div>

        {tiers.length === 0 ? (
          <div className="tm-empty">Create a band above to start adding trades.</div>
        ) : (
          <div className="tm-bands">
            {tiers.map((tier) => {
              const inTier = tradesInTier(tier.tierId);
              const selected = pick[tier.tierId] || "";
              const assigning = assigningTierId === tier.tierId;

              return (
                <div key={tier.tierId} className={`tm-band ${tier.isActive ? "" : "is-inactive"}`}>
                  <div className="tm-band-head">
                    <strong>{tier.tierName}</strong>
                    <span className="tm-credit-pill">{tier.unlockCredits} credits</span>
                    <span className="tm-band-count">
                      {inTier.length} trade{inTier.length === 1 ? "" : "s"}
                      {tier.isActive ? "" : " · inactive"}
                    </span>
                  </div>

                  <div className="tm-chips">
                    {inTier.length === 0 ? (
                      <span className="tm-muted">No trades in this band yet.</span>
                    ) : (
                      inTier.map((t) => (
                        <span key={t.key} className="tm-chip">
                          {t.name}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="tm-add">
                    <select
                      value={selected}
                      onChange={(e) =>
                        setPick((current) => ({ ...current, [tier.tierId]: e.target.value }))
                      }
                      disabled={!tier.isActive || assigning || busy}
                      aria-label={`Add a trade to ${tier.tierName}`}
                    >
                      <option value="">Select a trade to add…</option>
                      {trades
                        .filter((t) => tierByTrade.get(t.key) !== tier.tierId)
                        .map((t) => {
                          const owner = tiers.find((x) => x.tierId === tierByTrade.get(t.key));
                          return (
                            <option key={t.key} value={t.key}>
                              {t.name}
                              {owner ? ` (now in ${owner.tierName})` : " (no band)"}
                            </option>
                          );
                        })}
                    </select>
                    <button
                      type="button"
                      className="tm-primary tm-small"
                      onClick={() => handleAddTrade(tier)}
                      disabled={!selected || !tier.isActive || assigning || busy}
                    >
                      {assigning ? <Loader2 size={12} className="tm-spin" /> : <Plus size={12} />}
                      Add trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <style jsx>{`
        .tm-bands { padding: 17px 21px 21px; display: grid; gap: 13px; }
        .tm-band { border: 1px solid #e1e8f3; border-radius: 11px; padding: 14px 16px; display: grid; gap: 11px; background: #fcfdff; }
        .tm-band.is-inactive { opacity: .65; }
        .tm-band-head { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; color: #172b60; font-size: 15px; }
        .tm-credit-pill { padding: 4px 10px; border-radius: 20px; background: #fff2dc; color: #b86f00; font-size: 11px; font-weight: 800; }
        .tm-band-count { margin-left: auto; color: #66789c; font-size: 12px; }
        .tm-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .tm-chip { padding: 5px 11px; border-radius: 20px; border: 1px solid #d6e0ee; background: #fff; color: #31456f; font-size: 12px; font-weight: 600; }
        .tm-muted { color: #8a98b0; font-size: 12px; }
        .tm-add { display: flex; gap: 9px; flex-wrap: wrap; }
        .tm-add select { flex: 1; min-width: 200px; height: 36px; border: 1px solid #d6e0ee; border-radius: 8px; padding: 0 10px; font-size: 13px; color: #1e293b; background: #fff; }
        .tm-add select:focus { outline: none; border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }

        .tm { display: grid; gap: 19px; color: #172b60; }
        .tm-card { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); transition: border-color .2s ease, box-shadow .2s ease; }
        .tm-card.is-editing { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .1), 0 7px 21px rgba(27, 52, 102, .04); }

        .tm-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
        .tm-heading h4 { margin: 0 0 4px; color: #172b60; font-size: 20px; font-weight: 800; }
        .tm-heading p { margin: 0; color: #66789c; font-size: 12px; }
        .tm-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; }

        .tm-form { padding: 21px; display: grid; gap: 16px; }
        .tm-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
        .tm label { display: grid; gap: 6px; color: #64748b; font-size: 11px; font-weight: 800; }
        .tm input { width: 100%; box-sizing: border-box; height: 40px; border: 1px solid #d6e0ee; border-radius: 8px; padding: 8px 12px; outline: none; color: #1e293b; font-size: 13px; font-family: inherit; font-weight: 500; background: #fff; transition: border-color .15s ease, box-shadow .15s ease; }
        .tm input:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
        .tm input:disabled { background: #f8faff; }

        .tm-actions { display: flex; justify-content: flex-end; gap: 9px; }
        .tm-primary, .tm-ghost, .tm-danger, .tm-ok { min-height: 36px; padding: 8px 14px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; transition: background .15s ease, opacity .15s ease; }
        .tm-primary { border: 0; background: #ffa300; color: #fff; }
        .tm-primary:hover:not(:disabled) { background: #e08f00; }
        .tm-ghost { border: 1px solid #d6e0ee; background: #fff; color: #45577f; }
        .tm-ghost:hover:not(:disabled) { background: #f8faff; }
        .tm-danger { border: 1px solid #ffdada; background: #fff5f5; color: #b53c3c; }
        .tm-danger:hover:not(:disabled) { background: #ffe9e9; }
        .tm-ok { border: 1px solid #cfe9d6; background: #edf9f0; color: #247343; }
        .tm-ok:hover:not(:disabled) { background: #dff3e5; }
        .tm-small { min-height: 30px; padding: 5px 11px; font-size: 11px; }
        .tm-primary:disabled, .tm-ghost:disabled, .tm-danger:disabled, .tm-ok:disabled { opacity: .55; cursor: not-allowed; }
        .tm-primary:focus-visible, .tm-ghost:focus-visible, .tm-danger:focus-visible, .tm-ok:focus-visible { outline: 2px solid #172b60; outline-offset: 2px; }

        .tm-msg { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; }
        .tm-error { color: #a83232; background: #fff0f0; }
        .tm-success { color: #247343; background: #edf9f0; }

        .tm-table-wrap { width: 100%; overflow-x: auto; padding: 8px 21px 14px; box-sizing: border-box; }
        .tm-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
        .tm-table th { padding: 11px 12px; background: #f8faff; color: #667a9f; font-size: 11px; font-weight: 800; border-bottom: 1px solid #edf1f6; white-space: nowrap; }
        .tm-table td { padding: 12px; border-bottom: 1px solid #edf1f6; white-space: nowrap; vertical-align: middle; }
        .tm-table tbody tr:hover { background: #fffaf2; }
        .tm-table tbody tr.is-inactive .tm-name { color: #8a98b0; }
        .tm-table tbody tr.is-editing { background: #fff7e8; box-shadow: inset 3px 0 0 #ffa300; }
        .tm-name { color: #172b60; font-weight: 800; }

        .tm-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .tm-badge.active { color: #247343; background: #edf9f0; }
        .tm-badge.inactive { color: #a83232; background: #fff0f0; }
        .tm-row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 7px; }

        .tm-empty { padding: 28px 20px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #71809f; font-size: 12px; text-align: center; }

        @keyframes tm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        :global(.tm-spin) { animation: tm-spin 1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { :global(.tm-spin) { animation-duration: 2.5s; } }

        @media (max-width: 760px) {
          .tm-heading { display: flex; flex-wrap: wrap; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .tm-grid { grid-template-columns: 1fr; }
          .tm-table-wrap { padding: 8px 10px 14px; }
          .tm-table th, .tm-table td { padding: 10px 8px; }
        }
      `}</style>
    </div>
  );
}