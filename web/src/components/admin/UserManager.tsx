// src/components/admin/UserManager.tsx
import { useState, useMemo } from 'react'
import '../../styles/AdminComponents.css'

// ── Types ──────────────────────────────────────────
type UserStatus = 'active' | 'suspended' | 'new'
type FilterTab  = 'all' | 'active' | 'suspended' | 'new'

interface User {
  id: string
  name: string
  mobile: string
  email: string
  walletBalance: number
  totalBets: number
  totalDeposited: number
  joinDate: string
  lastActive: string
  status: UserStatus
}

// ── Mock data ──────────────────────────────────────
const initialUsers: User[] = [
  { id: 'USR-1042', name: 'Rahul Sharma',   mobile: '9876543210', email: 'rahul@gmail.com',  walletBalance: 5200,  totalBets: 48, totalDeposited: 15000, joinDate: '01 Jan 2026', lastActive: '2 min ago',   status: 'active'    },
  { id: 'USR-1039', name: 'Priya Patel',    mobile: '9812345678', email: 'priya@gmail.com',  walletBalance: 1800,  totalBets: 22, totalDeposited: 8000,  joinDate: '05 Jan 2026', lastActive: '18 min ago',  status: 'active'    },
  { id: 'USR-1031', name: 'Anil Kumar',     mobile: '9988776655', email: 'anil@yahoo.com',   walletBalance: 12400, totalBets: 91, totalDeposited: 45000, joinDate: '12 Dec 2025', lastActive: '1 hr ago',    status: 'active'    },
  { id: 'USR-1028', name: 'Sneha Joshi',    mobile: '9123456789', email: 'sneha@gmail.com',  walletBalance: 350,   totalBets: 7,  totalDeposited: 2000,  joinDate: '18 Mar 2026', lastActive: '3 hrs ago',   status: 'new'       },
  { id: 'USR-1022', name: 'Vikram Singh',   mobile: '9001234567', email: 'vikram@gmail.com', walletBalance: 0,     totalBets: 15, totalDeposited: 5000,  joinDate: '20 Nov 2025', lastActive: '2 days ago',  status: 'suspended' },
  { id: 'USR-1018', name: 'Kavya Reddy',    mobile: '9887654321', email: 'kavya@hotmail.com',walletBalance: 3100,  totalBets: 34, totalDeposited: 12000, joinDate: '08 Feb 2026', lastActive: '5 hrs ago',   status: 'active'    },
  { id: 'USR-1015', name: 'Mohan Das',      mobile: '9765432109', email: 'mohan@gmail.com',  walletBalance: 780,   totalBets: 11, totalDeposited: 3500,  joinDate: '14 Mar 2026', lastActive: 'Yesterday',   status: 'new'       },
  { id: 'USR-1010', name: 'Divya Nair',     mobile: '9654321098', email: 'divya@gmail.com',  walletBalance: 8900,  totalBets: 67, totalDeposited: 28000, joinDate: '03 Oct 2025', lastActive: 'Just now',    status: 'active'    },
  { id: 'USR-1005', name: 'Arjun Mehta',    mobile: '9543210987', email: 'arjun@gmail.com',  walletBalance: 0,     totalBets: 3,  totalDeposited: 1000,  joinDate: '01 Mar 2026', lastActive: '1 week ago',  status: 'suspended' },
  { id: 'USR-1001', name: 'Meena Iyer',     mobile: '9432109876', email: 'meena@gmail.com',  walletBalance: 2200,  totalBets: 29, totalDeposited: 9000,  joinDate: '22 Sep 2025', lastActive: '30 min ago',  status: 'active'    },
]

// ── Wallet Adjustment Modal ─────────────────────────
function WalletModal({ user, onClose, onConfirm }: {
  user: User
  onClose: () => void
  onConfirm: (type: 'credit' | 'debit', amount: number, reason: string) => void
}) {
  const [type,   setType]   = useState<'credit' | 'debit'>('credit')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="ac-modal-header">
          <h5 className="ac-modal-title">Adjust Wallet — {user.name}</h5>
          <button className="ac-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="ac-modal-body">
          <div className="ac-modal-row" style={{ marginBottom: 16 }}>
            <span className="ac-modal-row-label">Current Balance</span>
            <span className="ac-modal-row-val" style={{ color: '#17c653' }}>₹{user.walletBalance.toLocaleString()}</span>
          </div>

          {/* Credit / Debit toggle */}
          <div className="ac-modal-field">
            <label className="ac-modal-label">Adjustment Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['credit', 'debit'] as const).map(t => (
                <button
                  key={t} onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '8px', border: '1px solid',
                    borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                    borderColor: type === t ? (t === 'credit' ? '#17c653' : '#f8285a') : '#f1f1f4',
                    background: type === t ? (t === 'credit' ? 'rgba(23,198,83,0.08)' : 'rgba(248,40,90,0.06)') : '#f9fafb',
                    color: type === t ? (t === 'credit' ? '#17c653' : '#f8285a') : '#99a1b7',
                  }}
                >
                  <i className={`bi bi-${t === 'credit' ? 'plus' : 'dash'}-circle me-1`} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="ac-modal-field">
            <label className="ac-modal-label">Amount (₹)</label>
            <input
              className="ac-modal-input"
              type="number" min={1} placeholder="Enter amount"
              value={amount} onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div className="ac-modal-field" style={{ marginBottom: 0 }}>
            <label className="ac-modal-label">Reason</label>
            <input
              className="ac-modal-input"
              type="text" placeholder="e.g. Manual credit for dispute resolution"
              value={reason} onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="ac-modal-confirm"
            style={{ background: type === 'credit' ? '#17c653' : '#f8285a' }}
            disabled={!amount || !reason || Number(amount) <= 0}
            onClick={() => onConfirm(type, Number(amount), reason)}
          >
            <i className={`bi bi-${type === 'credit' ? 'plus' : 'dash'}-circle me-1`} />
            {type === 'credit' ? 'Credit' : 'Debit'} ₹{amount || '0'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── User Detail Modal ───────────────────────────────
function UserDetailModal({ user, onClose, onSuspend, onActivate, onWallet }: {
  user: User
  onClose: () => void
  onSuspend: () => void
  onActivate: () => void
  onWallet: () => void
}) {
  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="ac-modal-header">
          <h5 className="ac-modal-title">User Profile</h5>
          <button className="ac-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="ac-modal-body">
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f1f4' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#17c653', color: '#fff', fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {user.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#071437' }}>{user.name}</div>
              <div style={{ fontSize: 12, color: '#99a1b7' }}>{user.id}</div>
              <span className={`ac-badge ${user.status}`} style={{ marginTop: 4, display: 'inline-block' }}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
            {[
              { label: 'Mobile',         value: user.mobile          },
              { label: 'Email',          value: user.email           },
              { label: 'Joined',         value: user.joinDate        },
              { label: 'Last Active',    value: user.lastActive      },
              { label: 'Wallet Balance', value: `₹${user.walletBalance.toLocaleString()}`, color: '#17c653' },
              { label: 'Total Deposited',value: `₹${user.totalDeposited.toLocaleString()}` },
              { label: 'Total Bets',     value: user.totalBets.toString() },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#99a1b7', marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: row.color || '#071437', fontFamily: 'DM Mono, monospace' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="ac-modal-footer" style={{ flexWrap: 'wrap' }}>
          <button className="ac-btn wallet" style={{ flex: 1 }} onClick={() => { onClose(); onWallet() }}>
            <i className="bi bi-wallet2 me-1" />Adjust Wallet
          </button>
          {user.status === 'suspended' ? (
            <button className="ac-btn activate" style={{ flex: 1 }} onClick={() => { onActivate(); onClose() }}>
              <i className="bi bi-check-circle me-1" />Reactivate
            </button>
          ) : (
            <button className="ac-btn suspend" style={{ flex: 1 }} onClick={() => { onSuspend(); onClose() }}>
              <i className="bi bi-slash-circle me-1" />Suspend
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────
export default function UserManager() {
  const [users,        setUsers]        = useState<User[]>(initialUsers)
  const [activeTab,    setActiveTab]    = useState<FilterTab>('all')
  const [search,       setSearch]       = useState('')
  const [detailUser,   setDetailUser]   = useState<User | null>(null)
  const [walletUser,   setWalletUser]   = useState<User | null>(null)

  // Counts
  const counts = useMemo(() => ({
    all:       users.length,
    active:    users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    new:       users.filter(u => u.status === 'new').length,
  }), [users])

  const totalWallet = users.reduce((s, u) => s + u.walletBalance, 0)

  const filtered = useMemo(() => users.filter(u => {
    const matchTab    = activeTab === 'all' || u.status === activeTab
    const matchSearch = !search
      || u.name.toLowerCase().includes(search.toLowerCase())
      || u.mobile.includes(search)
      || u.email.toLowerCase().includes(search.toLowerCase())
      || u.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  }), [users, activeTab, search])

  // Actions
  const suspend  = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u))
  const activate = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active'    } : u))

  const adjustWallet = (userId: string, type: 'credit' | 'debit', amount: number) => {
    setUsers(prev => prev.map(u => u.id === userId
      ? { ...u, walletBalance: type === 'credit' ? u.walletBalance + amount : Math.max(0, u.walletBalance - amount) }
      : u
    ))
    setWalletUser(null)
  }

  return (
    <div className="ac-root">
      
      <p className="ac-page-sub">View, manage and control user accounts</p>

      {/* ── Stat cards ─────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'bi-people-fill',  cls: 'blue',   label: 'Total Users',     value: counts.all.toString()          },
          { icon: 'bi-person-check', cls: 'green',  label: 'Active',          value: counts.active.toString()       },
          { icon: 'bi-person-plus',  cls: 'teal',   label: 'New This Week',   value: counts.new.toString()          },
          { icon: 'bi-person-slash', cls: 'red',    label: 'Suspended',       value: counts.suspended.toString()    },
          { icon: 'bi-wallet2',      cls: 'amber',  label: 'Total in Wallets',value: `₹${totalWallet.toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-4 col-xl-2" style={{ flex: i === 4 ? '0 0 auto' : undefined }}>
            <div className="ac-stat-card">
              <div className={`ac-stat-icon ${s.cls}`}><i className={`bi ${s.icon}`} /></div>
              <div className="ac-stat-info">
                <div className="ac-stat-label">{s.label}</div>
                <div className="ac-stat-value">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main panel ─────────────────────────── */}
      <div className="ac-panel">

        {/* Tabs */}
        <div className="ac-tabs">
          {(['all', 'active', 'new', 'suspended'] as FilterTab[]).map(tab => (
            <button key={tab} className={`ac-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ac-tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="ac-toolbar">
          <div className="ac-search-wrap">
            <i className="bi bi-search ac-search-icon" />
            <input
              className="ac-search"
              placeholder="Search by name, mobile or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="ac-results">{filtered.length} users</span>
        </div>

        {/* Table */}
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Mobile</th>
                <th>Wallet</th>
                <th>Total Bets</th>
                <th>Deposited</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="ac-empty">
                      <div className="ac-empty-icon"><i className="bi bi-people" /></div>
                      <div className="ac-empty-title">No users found</div>
                      <div className="ac-empty-sub">Try adjusting your search or filter</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(user => (
                <tr key={user.id} style={{ cursor: 'pointer' }}>
                  <td onClick={() => setDetailUser(user)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="ac-user-avatar">{user.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</div>
                        <div className="muted">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono" onClick={() => setDetailUser(user)}>{user.mobile}</td>
                  <td onClick={() => setDetailUser(user)}>
                    <span className="mono" style={{ color: user.walletBalance > 0 ? '#17c653' : '#99a1b7' }}>
                      ₹{user.walletBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="mono" onClick={() => setDetailUser(user)}>{user.totalBets}</td>
                  <td className="mono" onClick={() => setDetailUser(user)}>₹{user.totalDeposited.toLocaleString()}</td>
                  <td className="muted" onClick={() => setDetailUser(user)}>{user.joinDate}</td>
                  <td className="muted" onClick={() => setDetailUser(user)}>{user.lastActive}</td>
                  <td onClick={() => setDetailUser(user)}>
                    <span className={`ac-badge ${user.status}`}>
                      {user.status === 'active'    ? '● Active'
                        : user.status === 'suspended' ? '✕ Suspended'
                        : '★ New'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button className="ac-btn view" title="View profile" onClick={() => setDetailUser(user)}>
                        <i className="bi bi-eye" />
                      </button>
                      <button className="ac-btn wallet" title="Adjust wallet" onClick={() => setWalletUser(user)}>
                        <i className="bi bi-wallet2" />
                      </button>
                      {user.status === 'suspended' ? (
                        <button className="ac-btn activate" title="Reactivate" onClick={() => activate(user.id)}>
                          <i className="bi bi-check-circle" />
                        </button>
                      ) : (
                        <button className="ac-btn suspend" title="Suspend" onClick={() => suspend(user.id)}>
                          <i className="bi bi-slash-circle" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User detail modal ───────────────────── */}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onSuspend={() => suspend(detailUser.id)}
          onActivate={() => activate(detailUser.id)}
          onWallet={() => setWalletUser(detailUser)}
        />
      )}

      {/* ── Wallet adjustment modal ─────────────── */}
      {walletUser && (
        <WalletModal
          user={walletUser}
          onClose={() => setWalletUser(null)}
          onConfirm={(type, amount) => adjustWallet(walletUser.id, type, amount)}
        />
      )}

    </div>
  )
}