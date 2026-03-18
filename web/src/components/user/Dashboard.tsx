// src/components/user/Dashboard.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import '../../styles/Dashboard.css'

// ── Mock data ──────────────────────────────────────
const betHistoryData = [
  { label: 'Mon', won: 3, lost: 1 },
  { label: 'Tue', won: 2, lost: 2 },
  { label: 'Wed', won: 5, lost: 1 },
  { label: 'Thu', won: 1, lost: 3 },
  { label: 'Fri', won: 4, lost: 2 },
  { label: 'Sat', won: 6, lost: 1 },
  { label: 'Sun', won: 3, lost: 2 },
]

const profitData = [
  { label: 'Mon', profit: -200  },
  { label: 'Tue', profit: 350   },
  { label: 'Wed', profit: 800   },
  { label: 'Thu', profit: -150  },
  { label: 'Fri', profit: 1200  },
  { label: 'Sat', profit: 2100  },
  { label: 'Sun', profit: 650   },
]

const betSplitData = [
  { name: 'Won',     value: 55, color: '#17c653' },
  { name: 'Lost',    value: 30, color: '#f8285a' },
  { name: 'Pending', value: 15, color: '#f6b100' },
]

const recentBets = [
  { race: 'Race #104', horse: 'Silver Bullet',  type: 'Win',   stake: 500,  odds: 4.5,  status: 'won'     },
  { race: 'Race #103', horse: 'Midnight Dash',  type: 'Place', stake: 200,  odds: 2.8,  status: 'lost'    },
  { race: 'Race #102', horse: 'Silver Foroxa',  type: 'Win',   stake: 300,  odds: 6.0,  status: 'won'     },
  { race: 'Race #101', horse: 'Roscor Dash',    type: 'Place', stake: 150,  odds: 1.8,  status: 'cashout' },
  { race: 'Race #100', horse: 'Silver Bullet',  type: 'Win',   stake: 500,  odds: 4.5,  status: 'pending' },
]

const upcomingRaces = [
  { num: '#104', name: 'Ascot Classic',    time: 'LIVE',   live: true  },
  { num: '#105', name: 'Kentucky Derby',   time: '15:30',  live: false },
  { num: '#106', name: 'Royal Cheltenham', time: '16:15',  live: false },
  { num: '#107', name: 'Mumbai Gold Cup',  time: '17:00',  live: false },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #f1f1f4', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#071437' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? (p.value >= 0 ? '#17c653' : '#f8285a'), fontFamily: 'DM Mono, monospace' }}>
          {p.name}: {p.name === 'profit' ? `₹${p.value}` : p.value}
        </div>
      ))}
    </div>
  )
}

export default function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const statCards = [
    { icon: 'bi-wallet2',        iconClass: 'green',  label: 'Wallet Balance',   value: '₹1,550',  badge: '',      badgeType: 'flat', badgeLabel: 'Available'       },
    { icon: 'bi-lightning-fill', iconClass: 'blue',   label: 'Total Bets',       value: '24',      badge: '+3',    badgeType: 'up',   badgeLabel: 'today'           },
    { icon: 'bi-trophy-fill',    iconClass: 'amber',  label: 'Win Rate',         value: '55%',     badge: '+4%',   badgeType: 'up',   badgeLabel: 'this week'       },
    { icon: 'bi-graph-up-arrow', iconClass: 'teal',   label: 'Net Profit',       value: '₹4,750',  badge: '+₹650', badgeType: 'up',   badgeLabel: 'today'           },
    { icon: 'bi-clock-history',  iconClass: 'purple', label: 'Pending Bets',     value: '2',       badge: '',      badgeType: 'flat', badgeLabel: 'awaiting result' },
    { icon: 'bi-cash-coin',      iconClass: 'red',    label: 'Total Wagered',    value: '₹12,400', badge: '',      badgeType: 'flat', badgeLabel: 'all time'        },
  ]

  return (
    <div className="db-root">
      <h4 className="db-page-title">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
      </h4>
      <p className="db-page-sub">Here's your betting summary for today.</p>

      {/* ── Stat cards ───────────────────────────── */}
      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div key={i} className="col-6 col-md-4 col-xl-2">
            <div className="db-stat-card">
              <div className={`db-stat-icon ${card.iconClass}`}>
                <i className={`bi ${card.icon}`} />
              </div>
              <div>
                <div className="db-stat-label">{card.label}</div>
                <div className="db-stat-value">{card.value}</div>
              </div>
              <div className={`db-stat-badge ${card.badgeType}`}>
                {card.badgeType === 'up'   && <i className="bi bi-arrow-up-short" />}
                {card.badgeType === 'down' && <i className="bi bi-arrow-down-short" />}
                {card.badge && <>{card.badge} </>}
                <span style={{ fontWeight: 400, opacity: 0.7 }}>{card.badgeLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">

        {/* ── Wallet card ──────────────────────── */}
        <div className="col-12 col-lg-3">
          <div className="db-wallet-card">
            <div className="db-wallet-label">Total Balance</div>
            <div className="db-wallet-balance">₹1,550.00</div>
            <div className="db-wallet-row">
              <span>Approved Funds</span>
              <span style={{ fontWeight: 700 }}>₹1,200.00</span>
            </div>
            <div className="db-wallet-row">
              <span>Pending Funds</span>
              <span style={{ fontWeight: 700 }}>₹350.00</span>
            </div>
            <button className="db-wallet-btn" onClick={() => navigate('/user/depositfunds')}>
              <i className="bi bi-plus-circle me-2" />
              Deposit Funds
            </button>
          </div>

          {/* Quick actions below wallet */}
          <div className="db-panel mt-3">
            <div className="db-panel-header">
              <div className="db-panel-title">Quick Actions</div>
            </div>
            <div className="db-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Place a Bet',      icon: 'bi-lightning',    href: '/user/betting',        color: '#17c653' },
                { label: 'View Races',       icon: 'bi-flag',         href: '/user/dashboard',      color: '#1b84ff' },
                { label: 'Betting History',  icon: 'bi-clock-history',href: '/user/bettinghistory', color: '#f6b100' },
              ].map((a, i) => (
                <a key={i} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                  background: '#f9fafb', border: '1px solid #f1f1f4',
                  fontSize: 13, fontWeight: 600, color: '#071437',
                  transition: 'background 0.15s',
                }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${a.icon}`} style={{ color: a.color, fontSize: 14 }} />
                  </span>
                  {a.label}
                  <i className="bi bi-chevron-right ms-auto" style={{ color: '#c8cdd8', fontSize: 11 }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Profit chart ─────────────────────── */}
        <div className="col-12 col-lg-5">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div>
                <div className="db-panel-title">Profit / Loss</div>
                <div className="db-panel-sub">Daily net this week</div>
              </div>
              <div className="db-period-tabs">
                {(['week', 'month'] as const).map(p => (
                  <button key={p} className={`db-period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="db-panel-body">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={profitData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="profit" name="profit" radius={[4, 4, 0, 0]} barSize={22}>
                    {profitData.map((entry, i) => (
                      <Cell key={i} fill={entry.profit >= 0 ? '#17c653' : '#f8285a'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Won / Lost this week summary */}
              <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f9fafb' }}>
                {[
                  { label: 'Total Won',  val: '₹6,400', color: '#17c653' },
                  { label: 'Total Lost', val: '₹1,650', color: '#f8285a' },
                  { label: 'Net',        val: '₹4,750', color: '#071437' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s.color, fontFamily: 'DM Mono, monospace' }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: '#99a1b7', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bet result donut ─────────────────── */}
        <div className="col-12 col-lg-4">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div>
                <div className="db-panel-title">Bet Results</div>
                <div className="db-panel-sub">All time breakdown</div>
              </div>
            </div>
            <div className="db-panel-body">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={betSplitData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                    {betSplitData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="db-legend mt-2">
                {betSplitData.map((d, i) => (
                  <div key={i} className="db-legend-item">
                    <span className="db-legend-dot" style={{ background: d.color }} />
                    <span className="db-legend-label">{d.name}</span>
                    <span className="db-legend-val">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent bets + Upcoming races ──────────── */}
      <div className="row g-3">

        {/* Recent bets table */}
        <div className="col-12 col-lg-8">
          <div className="db-panel">
            <div className="db-panel-header">
              <div className="db-panel-title">Recent Bets</div>
              <a href="/user/bettinghistory" style={{ fontSize: 12, color: '#1b84ff', fontWeight: 600, textDecoration: 'none' }}>
                View all →
              </a>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Race</th>
                    <th>Horse</th>
                    <th>Type</th>
                    <th>Stake</th>
                    <th>Odds</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBets.map((bet, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{bet.race}</td>
                      <td>{bet.horse}</td>
                      <td>{bet.type}</td>
                      <td className="mono">₹{bet.stake}</td>
                      <td className="mono">{bet.odds}</td>
                      <td><span className={`db-badge ${bet.status}`}>{bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming races */}
        <div className="col-12 col-lg-4">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div className="db-panel-title">Today's Races</div>
              <a href="/user/betting" style={{ fontSize: 12, color: '#17c653', fontWeight: 600, textDecoration: 'none' }}>
                Bet now →
              </a>
            </div>
            <div className="db-panel-body">
              {upcomingRaces.map((race, i) => (
                <div key={i} className="db-race-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/betting')}>
                  <span className="db-race-number">{race.num}</span>
                  <span className="db-race-name">{race.name}</span>
                  <span className={`db-race-time ${race.live ? 'live' : ''}`}>
                    {race.live ? '● LIVE' : race.time}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => navigate('/user/betting')}
                  style={{
                    width: '100%', background: '#17c653', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700,
                    padding: '10px', cursor: 'pointer',
                  }}
                >
                  <i className="bi bi-lightning-fill me-2" />
                  Place a Bet
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}