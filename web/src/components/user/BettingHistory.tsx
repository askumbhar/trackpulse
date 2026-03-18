// src/components/user/BettingHistory.tsx
import { useState } from 'react'
import { weekDays } from '../custom/WeekDays'
import '../../styles/BetSlip.css'

const todayIndex = weekDays.findIndex(d => d.isToday)

type BetStatus = 'Pending' | 'Won' | 'Lost' | 'Cashout'

interface Bet {
  id: number
  race: string
  horse: string
  betType: 'Win' | 'Place'
  stake: number
  odds: number
  status: BetStatus
  date: string
}

const allBets: Bet[] = [
  { id: 1,  race: 'Race #1',  horse: 'Silver Bullet',  betType: 'Win',   stake: 10.00, odds: 25.0, status: 'Pending', date: '09/2021' },
  { id: 2,  race: 'Race #2',  horse: 'Midnight Dash',  betType: 'Place', stake: 25.00, odds: 15.0, status: 'Won',     date: '09/2021' },
  { id: 3,  race: 'Race 43',  horse: 'Midnight Dash',  betType: 'Place', stake: 25.00, odds: 15.0, status: 'Won',     date: '09/2021' },
  { id: 4,  race: 'Race #4',  horse: 'Silver Bullet',  betType: 'Win',   stake: 35.00, odds: 15.0, status: 'Won',     date: '09/2021' },
  { id: 5,  race: 'Race 45',  horse: 'Pioar Frimma',   betType: 'Place', stake: 30.00, odds: 15.0, status: 'Cashout', date: '09/2021' },
  { id: 6,  race: 'Race 46',  horse: 'Pioar Frimma',   betType: 'Win',   stake: 25.00, odds: 15.0, status: 'Lost',    date: '09/2021' },
  { id: 7,  race: 'Race #7',  horse: 'Silver Bullet',  betType: 'Win',   stake: 15.00, odds: 9.0,  status: 'Won',     date: '09/2021' },
  { id: 8,  race: 'Race #8',  horse: 'Midnight Dash',  betType: 'Place', stake: 20.00, odds: 12.0, status: 'Pending', date: '09/2021' },
]

const STATUS_BADGE: Record<BetStatus, string> = {
  Won:     'rsw-status-won',
  Lost:    'rsw-status-lost',
  Pending: 'rsw-status-pending',
  Cashout: 'rsw-status-cashout',
}

export default function BettingHistory() {
  const [activeDay,  setActiveDay]  = useState(todayIndex)
  const [activeTab,  setActiveTab]  = useState<'all' | 'ongoing' | 'settled'>('all')
  const [filterDate, setFilterDate] = useState('All Date')

  const filtered = allBets.filter(b => {
    if (activeTab === 'ongoing') return b.status === 'Pending'
    if (activeTab === 'settled') return b.status !== 'Pending'
    return true
  })

  return (
    <div className="rsw-root">
      <h4 className="rsw-page-title">Betting History</h4>
      <p className="rsw-page-sub">Review your past bets and performance</p>

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

      <div className="rsw-panel">

        {/* All Bets / Ongoing / Settled tabs */}
        <div style={{ borderBottom: '1px solid #f1f1f4', padding: '0 16px', display: 'flex', gap: 0 }}>
          {(['all', 'ongoing', 'settled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 16px', fontSize: 13, fontWeight: 600,
                color: activeTab === tab ? '#071437' : '#99a1b7',
                borderBottom: activeTab === tab ? '2px solid #17c653' : '2px solid transparent',
                transition: 'all 0.2s', textTransform: 'capitalize',
              }}
            >
              {tab === 'all' ? 'All Bets' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f1f1f4', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#99a1b7', fontWeight: 500 }}>Filter By</span>
          <select
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ border: '1px solid #f1f1f4', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#071437', background: '#fff', cursor: 'pointer' }}
          >
            <option>All Date</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <span style={{ fontSize: 12, color: '#99a1b7', marginLeft: 'auto' }}>
            {filtered.length} bets
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="bi-table">
            <thead>
              <tr>
                <th>Race</th>
                <th>Horse</th>
                <th>Bet Type</th>
                <th>Stake</th>
                <th>Odds</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(bet => (
                <tr key={bet.id}>
                  <td style={{ fontWeight: 600, color: '#071437' }}>{bet.race}</td>
                  <td>{bet.horse}</td>
                  <td>{bet.betType}</td>
                  <td className="odds-val">₹{bet.stake.toFixed(2)}</td>
                  <td className="odds-val">{bet.odds.toFixed(1)}</td>
                  <td>
                    <span className={STATUS_BADGE[bet.status]}>{bet.status}</span>
                  </td>
                  <td>
                    <button className="rsw-shortcut-btn">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#99a1b7', fontSize: 13 }}>
            No bets found for this filter.
          </div>
        )}

      </div>
    </div>
  )
}