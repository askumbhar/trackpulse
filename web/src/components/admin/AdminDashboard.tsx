// src/components/admin/AdminDashboardPage.tsx
// Drop this as the content inside <AppLayout> for /admin/dashboard
import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import '../../styles/Dashboard.css'

// ── Mock data ──────────────────────────────────────────────────────────────
const revenueData = {
  week: [
    { label: 'Mon', revenue: 12400, bets: 340 },
    { label: 'Tue', revenue: 18200, bets: 480 },
    { label: 'Wed', revenue: 15600, bets: 410 },
    { label: 'Thu', revenue: 22800, bets: 590 },
    { label: 'Fri', revenue: 28400, bets: 720 },
    { label: 'Sat', revenue: 34200, bets: 890 },
    { label: 'Sun', revenue: 26100, bets: 650 },
  ],
  month: [
    { label: 'Wk 1', revenue: 82000, bets: 2100 },
    { label: 'Wk 2', revenue: 94000, bets: 2500 },
    { label: 'Wk 3', revenue: 78000, bets: 1900 },
    { label: 'Wk 4', revenue: 110000, bets: 2900 },
  ],
}

const betTypeData = [
  { name: 'Win',   value: 58, color: '#17c653' },
  { name: 'Place', value: 42, color: '#1b84ff' },
]

const cityData = [
  { city: 'Mumbai',    bets: 890 },
  { city: 'Bangalore', bets: 720 },
  { city: 'Delhi',     bets: 640 },
  { city: 'Kolkata',   bets: 480 },
  { city: 'Chennai',   bets: 390 },
  { city: 'Pune',      bets: 310 },
]

const recentActivity = [
  { type: 'green', title: 'Deposit approved',      meta: 'User #1042 · ₹5,000',     time: '2 min ago'  },
  { type: 'blue',  title: 'New user registered',   meta: 'Mobile: 98765XXXXX',       time: '8 min ago'  },
  { type: 'amber', title: 'Race file uploaded',    meta: 'Mumbai · 18 Mar 2026',     time: '15 min ago' },
  { type: 'red',   title: 'Deposit rejected',      meta: 'User #988 · ₹2,000',      time: '32 min ago' },
  { type: 'green', title: 'Race odds updated',     meta: 'Race #104 · Ascot 15:30',  time: '1 hr ago'   },
  { type: 'blue',  title: 'Bet placed',            meta: 'User #765 · Silver Bullet',time: '1 hr ago'   },
]

const pendingDeposits = [
  { user: 'User #1042', amount: 5000,  time: '2 min ago'  },
  { user: 'User #1039', amount: 2500,  time: '18 min ago' },
  { user: 'User #1031', amount: 10000, time: '45 min ago' },
  { user: 'User #1028', amount: 1500,  time: '1 hr ago'   },
]

const upcomingRaces = [
  { num: '#104', name: 'Ascot Classic',    time: 'LIVE',    live: true  },
  { num: '#105', name: 'Kentucky Derby',   time: '15:30',   live: false },
  { num: '#106', name: 'Royal Cheltenham', time: '16:15',   live: false },
  { num: '#107', name: 'Mumbai Gold Cup',  time: '17:00',   live: false },
  { num: '#108', name: 'Delhi Plate',      time: '17:45',   live: false },
]

// ── Custom tooltip ─────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #f1f1f4', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: '#071437' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontFamily: 'DM Mono, monospace' }}>
          {p.name}: {p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  )
}

// ── Component ──────────────────────────────────────
export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const statCards = [
    { icon: 'bi-trophy',         iconClass: 'green',  label: 'Total Races Today',   value: '24',          badge: '+3',   badgeType: 'up',   badgeLabel: 'vs yesterday' },
    { icon: 'bi-lightning-fill', iconClass: 'blue',   label: 'Total Bets Today',    value: '1,284',       badge: '+18%', badgeType: 'up',   badgeLabel: 'vs yesterday' },
    { icon: 'bi-cash-stack',     iconClass: 'amber',  label: 'Revenue Today',       value: '₹34,200',     badge: '+12%', badgeType: 'up',   badgeLabel: 'vs yesterday' },
    { icon: 'bi-people-fill',    iconClass: 'purple', label: 'Active Users',        value: '892',         badge: '+5%',  badgeType: 'up',   badgeLabel: 'this week'    },
    { icon: 'bi-clock-history',  iconClass: 'teal',   label: 'Pending Deposits',    value: '4',           badge: '',     badgeType: 'flat', badgeLabel: 'need review'  },
    { icon: 'bi-percent',        iconClass: 'red',    label: 'Platform Win Rate',   value: '58%',         badge: '+2%',  badgeType: 'up',   badgeLabel: 'this week'    },
  ]

  return (
    <div className="db-root">
      <h4 className="db-page-title">Admin Dashboard</h4>
      <p className="db-page-sub">Welcome back — here's what's happening on TrackPulse today.</p>

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
              {card.badge && (
                <div className={`db-stat-badge ${card.badgeType}`}>
                  {card.badgeType === 'up' && <i className="bi bi-arrow-up-short" />}
                  {card.badgeType === 'down' && <i className="bi bi-arrow-down-short" />}
                  {card.badge} <span style={{ fontWeight: 400, opacity: 0.7 }}>{card.badgeLabel}</span>
                </div>
              )}
              {!card.badge && <div className={`db-stat-badge ${card.badgeType}`}>{card.badgeLabel}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart + Bet type donut ────────── */}
      <div className="row g-3 mb-3">

        {/* Revenue area chart */}
        <div className="col-12 col-xl-8">
          <div className="db-panel">
            <div className="db-panel-header">
              <div>
                <div className="db-panel-title">Revenue & Bets</div>
                <div className="db-panel-sub">Daily totals for the selected period</div>
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
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData[period]} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#17c653" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#17c653" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1b84ff" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#1b84ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="revenue" stroke="#17c653" strokeWidth={2} fill="url(#colorRevenue)" dot={false} />
                  <Area type="monotone" dataKey="bets"    name="bets"    stroke="#1b84ff" strokeWidth={2} fill="url(#colorBets)"    dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, marginTop: 8, paddingTop: 8, borderTop: '1px solid #f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#99a1b7' }}>
                  <span style={{ width: 12, height: 3, background: '#17c653', borderRadius: 2, display: 'inline-block' }} />
                  Revenue (₹)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#99a1b7' }}>
                  <span style={{ width: 12, height: 3, background: '#1b84ff', borderRadius: 2, display: 'inline-block' }} />
                  Total Bets
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bet type donut */}
        <div className="col-12 col-xl-4">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div>
                <div className="db-panel-title">Bet Split</div>
                <div className="db-panel-sub">Win vs Place today</div>
              </div>
            </div>
            <div className="db-panel-body">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={betTypeData} cx="50%" cy="50%" innerRadius={44} outerRadius={64} paddingAngle={3} dataKey="value">
                    {betTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="db-legend mt-2">
                {betTypeData.map((d, i) => (
                  <div key={i} className="db-legend-item">
                    <span className="db-legend-dot" style={{ background: d.color }} />
                    <span className="db-legend-label">{d.name} Bets</span>
                    <span className="db-legend-val">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── City bar chart + Upcoming races + Pending deposits ── */}
      <div className="row g-3 mb-3">

        {/* Bets by city */}
        <div className="col-12 col-lg-5">
          <div className="db-panel">
            <div className="db-panel-header">
              <div>
                <div className="db-panel-title">Bets by City</div>
                <div className="db-panel-sub">Today's volume per venue</div>
              </div>
            </div>
            <div className="db-panel-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cityData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f4" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: '#99a1b7' }} axisLine={false} tickLine={false} width={72} />
                  <Tooltip cursor={{ fill: 'rgba(23,198,83,0.04)' }} content={<CustomTooltip />} />
                  <Bar dataKey="bets" name="bets" fill="#17c653" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Upcoming races */}
        <div className="col-12 col-lg-4">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div className="db-panel-title">Today's Races</div>
              <span style={{ fontSize: 11, color: '#17c653', fontWeight: 600 }}>{upcomingRaces.length} scheduled</span>
            </div>
            <div className="db-panel-body">
              {upcomingRaces.map((race, i) => (
                <div key={i} className="db-race-row">
                  <span className="db-race-number">{race.num}</span>
                  <span className="db-race-name">{race.name}</span>
                  <span className={`db-race-time ${race.live ? 'live' : ''}`}>
                    {race.live ? '● LIVE' : race.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending deposits */}
        <div className="col-12 col-lg-3">
          <div className="db-panel h-100">
            <div className="db-panel-header">
              <div className="db-panel-title">Pending Deposits</div>
              <span style={{ fontSize: 11, color: '#f6b100', fontWeight: 600 }}>{pendingDeposits.length} pending</span>
            </div>
            <div className="db-panel-body" style={{ padding: 0 }}>
              {pendingDeposits.map((dep, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f9fafb', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#071437' }}>{dep.user}</div>
                    <div style={{ fontSize: 11, color: '#99a1b7' }}>{dep.time}</div>
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 13, color: '#17c653' }}>
                    ₹{dep.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px' }}>
                <a href="/admin/deposits" style={{ fontSize: 12, color: '#1b84ff', fontWeight: 600, textDecoration: 'none' }}>
                  View all → 
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Recent activity ───────────────────────── */}
      <div className="row g-3">
        <div className="col-12">
          <div className="db-panel">
            <div className="db-panel-header">
              <div className="db-panel-title">Recent Activity</div>
              <span style={{ fontSize: 11, color: '#99a1b7' }}>Last 2 hours</span>
            </div>
            <div className="db-panel-body">
              <div className="row">
                {recentActivity.map((item, i) => (
                  <div key={i} className="col-12 col-md-6 col-xl-4">
                    <div className="db-activity-item">
                      <span className={`db-activity-dot ${item.type}`} />
                      <div style={{ flex: 1 }}>
                        <div className="db-activity-title">{item.title}</div>
                        <div className="db-activity-meta">{item.meta}</div>
                      </div>
                      <span className="db-activity-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}