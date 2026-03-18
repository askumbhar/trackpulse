// src/components/user/BetSlip.tsx
import { useState } from 'react'
import { weekDays } from '../custom/WeekDays'
import ConfirmBetModal from './ConfirmBetModal'
import '../../styles/BetSlip.css'

const todayIndex = weekDays.findIndex(d => d.isToday)

// Mock races — replace with API call
const races = [
  { id: 1, name: 'Kentucky Derby',  venue: 'Ascot 15:30', time: '15:30', horses: 204, tag: 'Shortlist' },
  { id: 2, name: 'Royal Ascot',     venue: 'Ascot 14:00', time: '14:00', horses: 188, tag: 'Main Race' },
  { id: 3, name: 'Cheltenham Gold', venue: 'Cheltenham',  time: '16:10', horses: 210, tag: 'Shortlist' },
]

// Mock horses for selected race
const horses = [
  { id: 1, name: 'Silver Bullet',  winOdds: 4.5,  placeOdds: 1.5  },
  { id: 2, name: 'Midnight Dash',  winOdds: 9.5,  placeOdds: 2.8  },
  { id: 3, name: 'Midnight Dash',  winOdds: 10.5, placeOdds: 3.0  },
  { id: 4, name: 'Silver Bullst',  winOdds: 3.0,  placeOdds: 1.2  },
  { id: 5, name: 'Silver Groove',  winOdds: 12.5, placeOdds: 3.5  },
  { id: 6, name: 'Silver Bullet',  winOdds: 4.5,  placeOdds: 1.5  },
  { id: 7, name: 'Midnight Dash',  winOdds: 13.5, placeOdds: 4.0  },
  { id: 8, name: 'Silver Bullet',  winOdds: 4.5,  placeOdds: 1.5  },
]

export default function BetSlip() {
  const [activeDay,    setActiveDay]    = useState(todayIndex)
  const [activeTab,    setActiveTab]    = useState<'shortlist' | 'main-race'>('shortlist')
  const [selectedRace, setSelectedRace] = useState(races[0])
  const [betType,      setBetType]      = useState<'win' | 'place'>('place')
  const [selectedHorse,setSelectedHorse]= useState<typeof horses[0] | null>(null)
  const [stake,        setStake]        = useState<number>(1)
  const [showModal,    setShowModal]    = useState(false)
  // betsPlaced counter (e.g. "BETS PLACED: 1/2")
  const [betsPlaced,   setBetsPlaced]   = useState(1)
  const totalBets = 2

  const selectedOdds = selectedHorse
    ? (betType === 'win' ? selectedHorse.winOdds : selectedHorse.placeOdds)
    : 0
  const potentialPayout = +(stake * selectedOdds).toFixed(2)

  const handlePlaceBet = () => {
    if (!selectedHorse) return
    setShowModal(true)
  }

  const handleConfirm = () => {
    setBetsPlaced(p => p + 1)
    setShowModal(false)
    setSelectedHorse(null)
    setStake(1)
  }

  return (
    <>
      <div className="rsw-root">

        {/* Tab toggles */}
        <div className="rsw-tabs">
          <button className={`rsw-tab ${activeTab === 'shortlist' ? 'active' : ''}`} onClick={() => setActiveTab('shortlist')}>Shortlist</button>
          <button className={`rsw-tab ${activeTab === 'main-race' ? 'active' : ''}`} onClick={() => setActiveTab('main-race')}>Main Race</button>
        </div>

        {/* Date strip */}
        <div className="rsw-date-strip">
          <button className="rsw-date-nav"><i className="bi bi-chevron-left" style={{ fontSize: 11 }} /></button>
          {weekDays.map((d, i) => (
            <div key={i} className={`rsw-date-pill ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>
              <span className="rsw-date-day">{d.day}</span>
              <span className="rsw-date-num">{d.date}</span>
            </div>
          ))}
          <button className="rsw-date-nav"><i className="bi bi-chevron-right" style={{ fontSize: 11 }} /></button>
        </div>

        <div className="row g-3">

          {/* ── Left: Active races ─────────────────── */}
          <div className="col-12 col-lg-5">
            <div className="rsw-panel">
              <div className="rsw-panel-header">
                <span>Active Races</span>
                <span style={{ fontSize: 11, color: '#99a1b7' }}>{races.length} races today</span>
              </div>
              {races.map(race => (
                <div
                  key={race.id}
                  className={`rsw-race-card ${selectedRace.id === race.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRace(race)}
                >
                  <div className="rsw-race-icon">🏇</div>
                  <div className="rsw-race-info">
                    <div className="rsw-race-name">{race.name}</div>
                    <div className="rsw-race-meta">
                      <span className="rsw-race-time">{race.time}</span>
                      <span className="rsw-race-horses">· {race.horses} horses</span>
                      <span className="rsw-race-tag">{race.tag}</span>
                    </div>
                  </div>
                  <i className="bi bi-chevron-right rsw-race-arrow" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Betting interface ────────────── */}
          <div className="col-12 col-lg-7">
            <div className="rsw-panel">

              {/* Header: race name + bets placed */}
              <div className="rsw-panel-header">
                <div>
                  <span style={{ fontSize: 12, color: '#99a1b7', marginRight: 6 }}>Active Race</span>
                  <strong>{selectedRace.venue}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#99a1b7', fontWeight: 500 }}>
                    BETS PLACED: <strong style={{ color: '#071437' }}>{betsPlaced}/{totalBets}</strong>
                  </span>
                  {/* Bet type selector */}
                  <div className="bet-type-wrap" style={{ marginBottom: 0 }}>
                    <label className="bet-type-option">
                      <input type="radio" name="betType" value="win"   checked={betType === 'win'}   onChange={() => setBetType('win')} /> Win
                    </label>
                    <label className="bet-type-option">
                      <input type="radio" name="betType" value="place" checked={betType === 'place'} onChange={() => setBetType('place')} /> Place
                    </label>
                  </div>
                </div>
              </div>

              {/* Horse table */}
              <div style={{ overflowX: 'auto' }}>
                <table className="bi-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Odds</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horses.map((h, i) => (
                      <tr
                        key={h.id}
                        style={{ background: selectedHorse?.id === h.id ? '#f0fdf5' : undefined, cursor: 'pointer' }}
                        onClick={() => setSelectedHorse(h)}
                      >
                        <td style={{ color: '#99a1b7', fontSize: 11 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{h.name}</td>
                        <td className="odds-val">{betType === 'win' ? h.winOdds : h.placeOdds}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedHorse?.id === h.id}
                            onChange={() => setSelectedHorse(selectedHorse?.id === h.id ? null : h)}
                            style={{ accentColor: '#17c653', width: 15, height: 15, cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stake + payout + CTA */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#99a1b7' }}>
                    Stake Amount
                  </label>
                  <input
                    type="number"
                    className="stake-input"
                    value={stake}
                    min={1}
                    onChange={e => setStake(Number(e.target.value))}
                  />
                </div>

                {selectedHorse && (
                  <div className="payout-box">
                    <div>
                      <div className="payout-label">Potential Payout</div>
                      <div style={{ fontSize: 11, color: '#99a1b7', marginTop: 2 }}>
                        {selectedHorse.name} · {betType.toUpperCase()} · Stake ₹{stake}
                      </div>
                    </div>
                    <div className="payout-value">₹{potentialPayout}</div>
                  </div>
                )}

                <button
                  className="place-bet-btn"
                  onClick={handlePlaceBet}
                  disabled={!selectedHorse}
                  style={{ opacity: selectedHorse ? 1 : 0.5 }}
                >
                  <i className="bi bi-lightning-fill" />
                  Place {betType === 'win' ? 'Win' : 'Place'} Bet
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Confirmation modal */}
      {showModal && selectedHorse && (
        <ConfirmBetModal
          horse={selectedHorse.name}
          betType={betType}
          odds={selectedOdds}
          stake={stake}
          payout={potentialPayout}
          raceName={selectedRace.venue}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}