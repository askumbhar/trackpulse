// src/components/user/RaceSelectionWallet.jsx
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { weekDays } from "../custom/WeekDays";

// ── Data ──────────────────────────────────────────────────────────────────────

// highlight today automatically
const todayIndex = weekDays.findIndex((d) => d.isToday);


const races = [
  { id: 1, name: "Kentucky Derby",   time: "15:30", horses: 204, tag: "Shortlist" },
  { id: 2, name: "Kentucky Derby",   time: "15:30", horses: 195, tag: "Shortcut"  },
  { id: 3, name: "Kentucky Derby",   time: "13:23", horses: 175, tag: "Shortcut"  },
  { id: 4, name: "Royal Ascot",      time: "14:00", horses: 188, tag: "Shortlist" },
  { id: 5, name: "Cheltenham Gold",  time: "16:10", horses: 210, tag: "Shortcut"  },
];



// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .rsw-root {
    font-family: 'DM Sans', sans-serif;
    background: #0f1117;
    min-height: 100vh;
    padding: 24px;
    color: #e2e8f0;
  }

  /* Page header */
  .rsw-page-title {
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 2px;
  }
  .rsw-page-sub {
    font-size: 12px;
    color: #475569;
    margin: 0 0 20px;
  }

  /* Tabs */
  .rsw-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .rsw-tab {
    background: #1a1f30;
    border: 1px solid #1e2640;
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rsw-tab.active {
    background: #1b84ff;
    border-color: #1b84ff;
    color: #fff;
  }
  .rsw-tab:hover:not(.active) {
    border-color: #2d3550;
    color: #94a3b8;
  }

  /* Date strip */
  .rsw-date-strip {
    display: flex;
    align-items: center;
    background: #151929;
    border: 1px solid #1e2640;
    border-radius: 10px;
    padding: 10px 14px;
    gap: 4px;
    margin-bottom: 20px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .rsw-date-strip::-webkit-scrollbar { display: none; }
  .rsw-date-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 52px;
    border: 1px solid transparent;
  }
  .rsw-date-pill:hover { background: #1e2438; }
  .rsw-date-pill.active {
    background: #1b84ff;
    border-color: #1b84ff;
  }
  .rsw-date-day {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
  }
  .rsw-date-pill.active .rsw-date-day { color: rgba(255,255,255,0.75); }
  .rsw-date-num {
    font-size: 16px;
    font-weight: 700;
    color: #cbd5e1;
    font-family: 'DM Mono', monospace;
    line-height: 1.2;
    margin-top: 2px;
  }
  .rsw-date-pill.active .rsw-date-num { color: #fff; }
  .rsw-date-nav {
    background: none;
    border: 1px solid #1e2640;
    border-radius: 6px;
    color: #64748b;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
    margin: 0 4px;
  }
  .rsw-date-nav:hover { border-color: #1b84ff; color: #1b84ff; }

  /* Panel */
  .rsw-panel {
    background: #151929;
    border: 1px solid #1e2640;
    border-radius: 10px;
    overflow: hidden;
  }
  .rsw-panel-header {
    background: #1a1f30;
    border-bottom: 1px solid #1e2640;
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Race card */
  .rsw-race-card {
    display: flex;
    align-items: center;
    padding: 13px 16px;
    border-bottom: 1px solid #1a1f2e;
    cursor: pointer;
    transition: background 0.15s;
    gap: 12px;
  }
  .rsw-race-card:last-child { border-bottom: none; }
  .rsw-race-card:hover { background: #1a1f2e; }
  .rsw-race-card.selected { background: #1a2540; border-left: 3px solid #1b84ff; }

  .rsw-race-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(27,132,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
  }
  .rsw-race-info { flex: 1; min-width: 0; }
  .rsw-race-name {
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rsw-race-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }
  .rsw-race-time {
    font-size: 11px;
    color: #64748b;
    font-family: 'DM Mono', monospace;
  }
  .rsw-race-horses {
    font-size: 11px;
    color: #475569;
  }
  .rsw-race-tag {
    font-size: 10px;
    font-weight: 600;
    background: rgba(16,185,129,0.12);
    color: #10b981;
    padding: 1px 7px;
    border-radius: 4px;
  }
  .rsw-race-arrow {
    color: #334155;
    font-size: 14px;
    transition: color 0.2s, transform 0.2s;
  }
  .rsw-race-card:hover .rsw-race-arrow { color: #1b84ff; transform: translateX(3px); }

  /* Wallet panel */
  .rsw-wallet {
    background: linear-gradient(135deg, #1a2540 0%, #151929 100%);
    border: 1px solid #1e3a5f;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }
  .rsw-wallet::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    background: rgba(27,132,255,0.06);
    border-radius: 50%;
  }
  .rsw-wallet-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
  }
  .rsw-wallet-balance {
    font-size: 32px;
    font-weight: 700;
    color: #f1f5f9;
    font-family: 'DM Mono', monospace;
    line-height: 1;
    margin-bottom: 16px;
  }
  .rsw-wallet-balance span {
    font-size: 18px;
    color: #64748b;
    margin-right: 2px;
  }
  .rsw-wallet-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .rsw-wallet-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12.5px;
  }
  .rsw-wallet-row-label { color: #64748b; }
  .rsw-wallet-row-value { font-family: 'DM Mono', monospace; font-weight: 600; }
  .rsw-wallet-row-value.approved { color: #10b981; }
  .rsw-wallet-row-value.pending  { color: #f59e0b; }

  .rsw-deposit-btn {
    width: 100%;
    background: #1b84ff;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .rsw-deposit-btn:hover  { background: #3b99ff; }
  .rsw-deposit-btn:active { transform: scale(0.98); }

  /* Betting history */
  .rsw-history-card {
    display: flex;
    align-items: center;
    padding: 11px 16px;
    border-bottom: 1px solid #1a1f2e;
    gap: 12px;
    transition: background 0.15s;
  }
  .rsw-history-card:last-child { border-bottom: none; }
  .rsw-history-card:hover { background: #1a1f2e; }
  .rsw-history-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(245,158,11,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 14px;
  }
  .rsw-history-info { flex: 1; min-width: 0; }
  .rsw-history-race {
    font-size: 12.5px;
    font-weight: 600;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rsw-history-meta {
    font-size: 11px;
    color: #475569;
    margin-top: 1px;
    font-family: 'DM Mono', monospace;
  }
  .rsw-shortcut-btn {
    background: rgba(27,132,255,0.1);
    border: 1px solid rgba(27,132,255,0.2);
    border-radius: 5px;
    color: #1b84ff;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 10px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .rsw-shortcut-btn:hover {
    background: rgba(27,132,255,0.2);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function RaceSelectionWallet() {
  
  const [selectedRace, setSelectedRace] = useState(1);
  const [activeDay, setActiveDay] = useState(todayIndex);

  return (
    <>
      <style>{styles}</style>
      <div className="rsw-root">

        {/* Page header */}
        <h4 className="rsw-page-title">Race Selection</h4>
        <p className="rsw-page-sub">Browse active races</p>


        {/* Date strip */}
        <div className="rsw-date-strip">
          <button className="rsw-date-nav">
            <i className="bi bi-chevron-left" style={{ fontSize: 11 }} />
          </button>
          {weekDays.map((d, i) => (
            <div
              key={i}
              className={`rsw-date-pill ${activeDay === i ? "active" : ""}`}
              onClick={() => setActiveDay(i)}
            >
              <span className="rsw-date-day">{d.day}</span>
              <span className="rsw-date-num">{d.date}</span>
            </div>
          ))}
          <button className="rsw-date-nav">
            <i className="bi bi-chevron-right" style={{ fontSize: 11 }} />
          </button>
        </div>

        {/* Two-column layout */}
        <div className="row">

          {/* ── Left: Active Races ──────────────────── */}
          <div className="col-12">
            <div className="rsw-panel">
              <div className="rsw-panel-header">
                <span>Active Races</span>
                <span style={{ color: "#1b84ff", fontSize: 11 }}>
                  {races.length} races today
                </span>
              </div>

              {races.map((race) => (
                <div
                  key={race.id}
                  className={`rsw-race-card ${selectedRace === race.id ? "selected" : ""}`}
                  onClick={() => setSelectedRace(race.id)}
                >
                  <div className="rsw-race-icon">🏇</div>
                  <div className="rsw-race-info">
                    <div className="rsw-race-name">{race.name}</div>
                    <div className="rsw-race-meta">
                      <span className="rsw-race-time">{race.time}</span>
                      <span className="rsw-race-horses">
                        · {race.horses} horses
                      </span>
                      <span className="rsw-race-tag">{race.tag}</span>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right rsw-race-arrow" />
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}