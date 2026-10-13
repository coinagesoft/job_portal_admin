"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Layers,
  Loader2,
  RefreshCw,
  Save,
  Search,
} from "lucide-react";
import { homepageService } from "../services/homepageService";

/* ------------------------------ pure helpers ------------------------------ */

const norm = (value) => String(value ?? "").trim().toLowerCase();

// /trade-categories returns { id, name, isActive }; /trade-credit/mappings
// returns { tradeCategoryId, ... }. Read both so IDs always match.
const getTradeId = (item) =>
  norm(item?.tradeCategoryId ?? item?.TradeCategoryId ?? item?.id ?? item?.Id);

const getTierId = (item) => norm(item?.tierId ?? item?.TierId);
const getTierName = (item) => item?.tierName ?? item?.TierName ?? "";
const getTierCredits = (tier) => tier?.unlockCredits ?? tier?.UnlockCredits ?? "";
const getSubTradeId = (item) => item?.subTradeId ?? item?.SubTradeId ?? null;
const getName = (item) => item?.name ?? item?.Name ?? "";
const isActiveItem = (item) => item?.isActive !== false && item?.IsActive !== false;

// Same trade name (ignoring case and extra spaces) = same trade.
const groupKeyOf = (trade) => {
  const name = String(getName(trade)).trim().replace(/\s+/g, " ").toLowerCase();
  return name || `id:${getTradeId(trade)}`;
};

// Supports a direct array or { success, count, data: [...] }.
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

const EMPTY_SAVED = {
  tierId: "",
  tierName: "",
  status: "unassigned", // unassigned | assigned | partial | conflict
  mapped: 0,
  total: 0,
  members: {},
};

const PAGE_SIZE = 25;

/* -------------------------------- component -------------------------------- */

export default function TradeCreditAssignment() {
  const [groups, setGroups] = useState([]); // [{ key, name, ids: [tradeId, ...] }]
  const [tiers, setTiers] = useState([]);
  const [assignments, setAssignments] = useState({}); // edited values, by group key
  const [savedMap, setSavedMap] = useState({}); // server values, by group key
  const savedRef = useRef({});

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null); // group key | "all" | null
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | assigned | unassigned | sync | unsaved
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ------------------------------- data load ------------------------------- */

  const loadData = useCallback(async ({ silent = false, savedGroupKey = null } = {}) => {
    if (!silent) setLoading(true);

    try {
      const [tradeRes, tierRes, mappingRes] = await Promise.all([
        homepageService.getTradeCategories(),
        homepageService.getTradeCreditTiers(),
        homepageService.getTradeCreditMappings(),
      ]);

      const activeTrades = getArray(tradeRes).filter(isActiveItem);
      const activeTiers = getArray(tierRes)
        .filter(isActiveItem)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      // Main trades only: ignore sub-trade mappings.
      const mainMappings = getArray(mappingRes).filter(
        (m) => getSubTradeId(m) == null && isActiveItem(m)
      );

      const mappingByTradeId = new Map();
      mainMappings.forEach((m) => {
        const id = getTradeId(m);
        if (id && !mappingByTradeId.has(id)) mappingByTradeId.set(id, m);
      });

      // Group trades that share a name.
      const groupMap = new Map();
      activeTrades.forEach((trade) => {
        const id = getTradeId(trade);
        if (!id) return;
        const key = groupKeyOf(trade);
        if (!groupMap.has(key)) {
          groupMap.set(key, { key, name: String(getName(trade)).trim() || "Unnamed trade", ids: [] });
        }
        groupMap.get(key).ids.push(id);
      });

      const nextGroups = [...groupMap.values()].sort((a, b) => a.name.localeCompare(b.name));

      const nextSaved = {};
      nextGroups.forEach((group) => {
        const members = {};
        group.ids.forEach((id) => {
          const m = mappingByTradeId.get(id);
          members[id] = m ? { tierId: getTierId(m), tierName: getTierName(m) } : null;
        });

        const mappedList = group.ids.map((id) => members[id]).filter(Boolean);

        if (mappedList.length === 0) {
          nextSaved[group.key] = { ...EMPTY_SAVED, total: group.ids.length, members };
          return;
        }

        // Baseline = the first copy that already has a tier.
        const base = mappedList[0];
        const allSame = mappedList.every((m) => m.tierId === base.tierId);

        let status = "assigned";
        if (!allSame) status = "conflict";
        else if (mappedList.length < group.ids.length) status = "partial";

        nextSaved[group.key] = {
          tierId: base.tierId,
          tierName: base.tierName,
          status,
          mapped: mappedList.length,
          total: group.ids.length,
          members,
        };
      });

      const prevSaved = savedRef.current;
      savedRef.current = nextSaved;

      setGroups(nextGroups);
      setTiers(activeTiers);
      setSavedMap(nextSaved);

      // On a silent reload keep edits made on other rows.
      setAssignments((prev) => {
        const next = {};
        Object.keys(nextSaved).forEach((key) => {
          const old = prev[key];
          const was = prevSaved[key];
          const hadUnsavedEdit =
            silent &&
            key !== savedGroupKey &&
            old &&
            was &&
            old.tierId !== was.tierId;
          next[key] = hadUnsavedEdit ? old : { tierId: nextSaved[key].tierId };
        });
        return next;
      });
    } catch (err) {
      console.error("Failed to load trade assignments:", err);
      setError(err?.message || "Could not load trade credit assignments. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  /* ------------------------------- row state ------------------------------- */

  const tierIds = useMemo(() => new Set(tiers.map(getTierId)), [tiers]);

  const rowState = useCallback(
    (key) => {
      const current = assignments[key] || { tierId: "" };
      const saved = savedMap[key] || EMPTY_SAVED;
      const edited = current.tierId !== saved.tierId;
      const needsSync = saved.status === "partial" || saved.status === "conflict";
      return { current, saved, edited, needsSync, isDirty: edited || needsSync };
    },
    [assignments, savedMap]
  );

  const counts = useMemo(() => {
    const result = { total: groups.length, assigned: 0, unassigned: 0, sync: 0, unsaved: 0, pending: 0 };
    groups.forEach((group) => {
      const s = rowState(group.key);
      if (s.saved.status === "assigned") result.assigned++;
      if (s.saved.status === "unassigned") result.unassigned++;
      if (s.needsSync) result.sync++;
      if (s.edited) result.unsaved++;
      if (s.isDirty) result.pending++;
    });
    return result;
  }, [groups, rowState]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((group) => {
      if (q && !group.name.toLowerCase().includes(q)) return false;
      const s = rowState(group.key);
      if (filter === "assigned") return s.saved.status === "assigned";
      if (filter === "unassigned") return s.saved.status === "unassigned";
      if (filter === "sync") return s.needsSync;
      if (filter === "unsaved") return s.edited;
      return true;
    });
  }, [groups, search, filter, rowState]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageGroups = filteredGroups.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* -------------------------------- actions -------------------------------- */

  const updateAssignment = (key, field, value) => {
    setSuccess("");
    setAssignments((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { tierId: "" }), [field]: value },
    }));
  };

  const validate = (group) => {
    const { tierId } = assignments[group.key] || {};

    if (!tierId) return `Select a tier for ${group.name}.`;
    if (!tierIds.has(tierId)) return `The tier for ${group.name} is inactive. Choose an active tier.`;
    return "";
  };

  // The backend applies the tier to EVERY trade with the same name,
  // so one request per trade name is enough.
  const applyToGroup = async (group) => {
    const { tierId } = assignments[group.key];
    const members = savedRef.current[group.key]?.members || {};

    const needsSave = group.ids.some((id) => !members[id] || members[id].tierId !== tierId);
    if (!needsSave) return { attempted: 0, failed: 0 };

    try {
      await homepageService.saveMainTradeCreditMapping(group.ids[0], { tierId });
      return { attempted: 1, failed: 0 };
    } catch (err) {
      console.error("Failed to save", group.name, err);
      return { attempted: 1, failed: 1 };
    }
  };

  const saveOne = async (group) => {
    setError("");
    setSuccess("");

    const problem = validate(group);
    if (problem) {
      setError(problem);
      return;
    }

    setSavingKey(group.key);
    try {
      const { failed } = await applyToGroup(group);

      if (failed > 0) {
        setError(`Could not save ${group.name}. Try again.`);
      } else {
        setSuccess(
          group.ids.length > 1
            ? `Saved ${group.name} across all ${group.ids.length} entries.`
            : `Saved ${group.name}.`
        );
      }
      await loadData({ silent: true, savedGroupKey: group.key });
    } catch (err) {
      console.error("Failed to save trade assignment:", err);
      setError(err?.message || `Could not save ${group.name}. Try again.`);
    } finally {
      setSavingKey(null);
    }
  };

  const saveAllPending = async () => {
    const pending = groups.filter((group) => rowState(group.key).isDirty);
    if (pending.length === 0) return;

    setError("");
    setSuccess("");

    const invalid = pending.map(validate).find(Boolean);
    if (invalid) {
      setError(invalid);
      return;
    }

    setSavingKey("all");
    const failedNames = [];
    for (const group of pending) {
      try {
        const { failed } = await applyToGroup(group);
        if (failed > 0) failedNames.push(group.name);
      } catch (err) {
        console.error("Failed to save", group.name, err);
        failedNames.push(group.name);
      }
    }

    await loadData({ silent: true });
    setSavingKey(null);

    if (failedNames.length) {
      setError(
        `Saved ${pending.length - failedNames.length} of ${pending.length} trades. Failed: ${failedNames.join(", ")}.`
      );
    } else {
      setSuccess(`Saved ${pending.length} trade${pending.length === 1 ? "" : "s"}.`);
    }
  };

  const refresh = () => {
    if (counts.unsaved > 0 && !window.confirm("Refreshing will discard unsaved changes. Continue?")) {
      return;
    }
    setError("");
    setSuccess("");
    loadData();
  };

  /* --------------------------------- render --------------------------------- */

  if (loading) {
    return (
      <section className="tca-card">
        <div className="tca-empty">
          <Loader2 size={22} className="tca-spin" />
          Loading trade credit assignments...
        </div>
        <style jsx>{styles}</style>
      </section>
    );
  }

  const busy = savingKey !== null;

  return (
    <div className="tca">
      <section className="tca-card">
        <div className="tca-heading">
          <span className="tca-icon">
            <Layers size={19} />
          </span>
          <div>
            <h4>Trade credit assignment</h4>
            <p>
              Assign a tier to each main trade. Credits come from the tier. A trade name used in more than one
              place shares one tier, and Save updates every copy.
            </p>
          </div>
          <div className="tca-heading-actions">
            <button type="button" className="tca-ghost" onClick={refresh} disabled={busy}>
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              className="tca-primary"
              onClick={saveAllPending}
              disabled={busy || counts.pending === 0}
            >
              {savingKey === "all" ? <Loader2 size={14} className="tca-spin" /> : <Save size={14} />}
              {counts.pending > 0 ? `Save ${counts.pending} pending` : "No changes"}
            </button>
          </div>
        </div>

        <div className="tca-summary">
          <button type="button" className={filter === "all" ? "is-on" : ""} onClick={() => setFilter("all")}>
            <strong>{counts.total}</strong>
            <span>Trades</span>
          </button>
          <button type="button" className={filter === "assigned" ? "is-on" : ""} onClick={() => setFilter("assigned")}>
            <strong>{counts.assigned}</strong>
            <span>Assigned</span>
          </button>
          <button type="button" className={filter === "unassigned" ? "is-on" : ""} onClick={() => setFilter("unassigned")}>
            <strong>{counts.unassigned}</strong>
            <span>Not assigned</span>
          </button>
          <button type="button" className={filter === "sync" ? "is-on" : ""} onClick={() => setFilter("sync")}>
            <strong>{counts.sync}</strong>
            <span>Needs sync</span>
          </button>
          <button type="button" className={filter === "unsaved" ? "is-on" : ""} onClick={() => setFilter("unsaved")}>
            <strong>{counts.unsaved}</strong>
            <span>Unsaved</span>
          </button>
        </div>

        {counts.sync > 0 && (
          <div className="tca-msg tca-info" role="status">
            <AlertTriangle size={16} />
            {counts.sync} trade{counts.sync === 1 ? " has" : "s have"} copies with a missing or different tier. Use
            Sync on the row, or Save pending, to apply one tier to every copy.
          </div>
        )}

        {error && (
          <div className="tca-msg tca-error" role="alert">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="tca-msg tca-success" role="status">
            <Check size={16} />
            {success}
          </div>
        )}

       <div className="tca-toolbar">
  <div className="tca-search">
    <span
      className="tca-search-icon"
      style={{
        position: "absolute",
        left: 14,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        color: "#94a3b8",
      }}
    >
      <Search size={18} />
    </span>
    <input
      type="text"
      placeholder="Search main trades"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  </div>
  <span className="tca-count">
    {filteredGroups.length} trade{filteredGroups.length === 1 ? "" : "s"}
  </span>
</div>

        <div className="tca-table-wrap">
          <table className="tca-table">
            <thead>
              <tr>
                <th>Main trade</th>
                <th>Tier</th>
                <th>Credits</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {pageGroups.map((group) => {
                const { current, saved, edited, needsSync, isDirty } = rowState(group.key);
                const tierIsActive = tierIds.has(current.tierId);
                const rowSaving = savingKey === group.key;
                const copies = group.ids.length;
                const selectedTier = tiers.find((t) => getTierId(t) === current.tierId);
                const credits = getTierCredits(selectedTier);

                return (
                  <tr key={group.key} className={isDirty ? "is-dirty" : ""}>
                    <td>
                      <span className="tca-name">{group.name}</span>
                      {copies > 1 && (
                        <span className="tca-copies" title="This trade name exists more than once. Saving updates all copies.">
                          {copies} entries
                        </span>
                      )}
                    </td>

                    <td>
                      <select
                        value={current.tierId}
                        disabled={busy}
                        aria-label={`Tier for ${group.name}`}
                        onChange={(event) => updateAssignment(group.key, "tierId", event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") saveOne(group);
                        }}
                      >
                        <option value="">Select tier</option>
                        {tiers.map((tier) => (
                          <option key={getTierId(tier)} value={getTierId(tier)}>
                            {getTierName(tier)}
                          </option>
                        ))}
                        {current.tierId && !tierIsActive && (
                          <option value={current.tierId}>
                            {saved.tierName ? `${saved.tierName} (inactive)` : "Inactive tier"}
                          </option>
                        )}
                      </select>
                      {current.tierId && !tierIsActive && (
                        <small className="tca-warn">This tier is inactive. Pick an active one to save.</small>
                      )}
                    </td>

                    <td>
                      <span className="tca-name">{credits !== "" ? credits : "—"}</span>
                    </td>

                    <td>
                      {edited ? (
                        <span className="tca-badge unsaved">Unsaved</span>
                      ) : saved.status === "partial" ? (
                        <>
                          <span className="tca-badge sync">Needs sync</span>
                          <small className="tca-sub">
                            {saved.mapped} of {saved.total} assigned
                          </small>
                        </>
                      ) : saved.status === "conflict" ? (
                        <>
                          <span className="tca-badge sync">Tiers differ</span>
                          <small className="tca-sub">Copies have different tiers</small>
                        </>
                      ) : saved.status === "assigned" ? (
                        <span className="tca-badge assigned">Assigned</span>
                      ) : (
                        <span className="tca-badge pending">Not assigned</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="tca-primary tca-row-save"
                        disabled={busy || !isDirty}
                        onClick={() => saveOne(group)}
                      >
                        {rowSaving ? <Loader2 size={13} className="tca-spin" /> : null}
                        {rowSaving ? "Saving" : needsSync && !edited ? "Sync" : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pageGroups.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="tca-empty">
                      {groups.length === 0
                        ? "No active main trades yet. Add trades in the Recruiter tab first."
                        : "No trades match this search or filter."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="tca-pager">
            <button type="button" className="tca-ghost" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              Previous
            </button>
            <span>
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="tca-ghost"
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <style jsx>{styles}</style>
    </div>
  );
}

/* ---------------------------------- styles ---------------------------------- */

const styles = `
  .tca { display: grid; gap: 19px; color: #172b60; }
  .tca-card { overflow: hidden; border: 1px solid #e1e8f3; border-radius: 13px; background: #fff; box-shadow: 0 7px 21px rgba(27, 52, 102, .04); }

  .tca-heading { min-height: 60px; padding: 17px 21px; display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; border-bottom: 1px solid #edf1f6; }
  .tca-heading h4 { margin: 0 0 4px; color: #172b60; font-size: 20px; font-weight: 800; }
  .tca-heading p { margin: 0; color: #66789c; font-size: 12px; max-width: 620px; }
  .tca-icon { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 9px; background: #fff2dc; color: #f29a00; }
  .tca-heading-actions { display: flex; gap: 8px; align-items: center; }

  .tca-primary, .tca-ghost { min-height: 36px; padding: 8px 14px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; transition: background .15s ease, opacity .15s ease; }
  .tca-primary { border: 0; background: #ffa300; color: #fff; }
  .tca-primary:hover:not(:disabled) { background: #e08f00; }
  .tca-ghost { border: 1px solid #d6e0ee; background: #fff; color: #45577f; }
  .tca-ghost:hover:not(:disabled) { background: #f8faff; }
  .tca-primary:disabled, .tca-ghost:disabled { opacity: .5; cursor: not-allowed; }
  .tca-primary:focus-visible, .tca-ghost:focus-visible, .tca-summary button:focus-visible { outline: 2px solid #172b60; outline-offset: 2px; }

  .tca-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; padding: 18px 21px 6px; }
  .tca-summary button { display: grid; gap: 2px; text-align: left; padding: 12px 14px; border: 1px solid #e3eaf4; border-radius: 10px; background: #fbfcfe; cursor: pointer; transition: border-color .15s ease, background .15s ease; }
  .tca-summary button:hover { border-color: #ffd28a; background: #fffaf2; }
  .tca-summary button.is-on { border-color: #ffa300; background: #fff7e8; box-shadow: 0 0 0 2px rgba(255, 163, 0, .08); }
  .tca-summary strong { color: #172b60; font-size: 22px; font-weight: 800; line-height: 1.1; }
  .tca-summary span { color: #71809f; font-size: 12px; font-weight: 600; }

  .tca-msg { margin: 14px 21px 0; display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; }
  .tca-error { color: #a83232; background: #fff0f0; }
  .tca-success { color: #247343; background: #edf9f0; }
  .tca-info { color: #7a4d00; background: #fff7e8; border: 1px solid #ffe2b0; }

  .tca-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 21px;
    margin: 18px 0 14px;
  }

  .tca-search {
    position: relative;
    display: flex;
    align-items: center;
    width: min(100%, 460px);
    height: 44px;
  }

  .tca-search :global(svg) {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #94a3b8;
    pointer-events: none;
  }

  /* higher specificity so it beats the generic ".tca input" rule */
  .tca .tca-search input {
    width: 100%;
    height: 100%;
    padding: 0 14px 0 42px;
    border: 1px solid #d6e0ee;
    border-radius: 10px;
    font-size: 14px;
  }

  .tca .tca-search input::placeholder {
    color: #94a3b8;
    opacity: 1;
  }

  .tca .tca-search input:focus {
    border-color: #ffa300;
    box-shadow: 0 0 0 3px rgba(255, 163, 0, 0.12);
  }

  .tca-count {
    flex-shrink: 0;
    color: #66789c;
    font-size: 13px;
    font-weight: 600;
  }

  .tca input, .tca select { width: 100%; box-sizing: border-box; height: 38px; border: 1px solid #d6e0ee; border-radius: 8px; padding: 8px 12px; outline: none; color: #1e293b; font-size: 13px; font-family: inherit; font-weight: 500; background: #fff; transition: border-color .15s ease, box-shadow .15s ease; }
  .tca select { appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 32px; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E"); background-position: right 10px center; background-repeat: no-repeat; background-size: 18px 18px; }
  
  
  .tca input:focus, .tca select:focus { border-color: #ffa300; box-shadow: 0 0 0 3px rgba(255, 163, 0, .09); }
  .tca input:disabled, .tca select:disabled { background: #f8faff; }

  .tca-table-wrap { width: 100%; overflow-x: auto; padding: 0 21px 8px; box-sizing: border-box; }
  .tca-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
  .tca-table th { padding: 11px 12px; background: #f8faff; color: #667a9f; font-size: 11px; font-weight: 800; border-bottom: 1px solid #edf1f6; white-space: nowrap; }
  .tca-table td { padding: 10px 12px; border-bottom: 1px solid #edf1f6; vertical-align: middle; }
  .tca-table th:nth-child(2), .tca-table td:nth-child(2) { min-width: 200px; }
  .tca-table th:nth-child(3), .tca-table td:nth-child(3) { min-width: 150px; width: 170px; }
  .tca-table th:nth-child(4), .tca-table td:nth-child(4) { min-width: 140px; }
  .tca-table tbody tr:hover { background: #fffaf2; }
  .tca-table tbody tr.is-dirty { background: #fff7e8; box-shadow: inset 3px 0 0 #ffa300; }
  .tca-name { color: #172b60; font-weight: 700; }
  .tca-copies { margin-left: 8px; display: inline-block; padding: 3px 8px; border-radius: 20px; background: #eef3ff; color: #3554a3; font-size: 10px; font-weight: 800; white-space: nowrap; }
  .tca-warn { display: block; margin-top: 4px; color: #a83232; font-size: 11px; }
  .tca-sub { display: block; margin-top: 4px; color: #8a98b0; font-size: 11px; }

  .tca-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; white-space: nowrap; }
  .tca-badge.assigned { color: #247343; background: #edf9f0; }
  .tca-badge.pending { color: #7a4d00; background: #fff2dc; }
  .tca-badge.unsaved { color: #3554a3; background: #eef3ff; }
  .tca-badge.sync { color: #a83232; background: #fff0f0; }
  .tca-row-save { min-width: 78px; min-height: 34px; padding: 6px 12px; }

  .tca-empty { padding: 28px 20px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #71809f; font-size: 12px; text-align: center; }
  .tca-pager { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 8px 21px 20px; color: #71809f; font-size: 12px; font-weight: 700; }

  @keyframes tca-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  :global(.tca-spin) { animation: tca-spin 1s linear infinite; }
  @media (prefers-reduced-motion: reduce) { :global(.tca-spin) { animation-duration: 2.5s; } }

  @media (max-width: 900px) {
    .tca-heading { display: flex; flex-wrap: wrap; align-items: flex-start; }
    .tca-heading-actions { width: 100%; }
  }
  @media (max-width: 600px) {
    .tca-toolbar { flex-direction: column; align-items: stretch; }
    .tca-search { max-width: none; }
    .tca-table-wrap { padding: 0 10px 8px; }
  }
`;