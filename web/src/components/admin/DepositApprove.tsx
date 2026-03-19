// src/components/admin/DepositApprove.tsx
import { useState, useMemo } from 'react'
import '../../styles/AdminComponents.css'

// ── Types ──────────────────────────────────────────
type DepositStatus = 'pending' | 'approved' | 'rejected'
type FilterTab     = 'all' | 'pending' | 'approved' | 'rejected'

interface Deposit {
  id: number
  userId: string
  name: string
  mobile: string
  amount: number
  method: string
  transactionId: string
  submittedAt: string
  screenshotUrl: string | null
  status: DepositStatus
  rejectionReason?: string
}

// ── Mock data ──────────────────────────────────────
const initialDeposits: Deposit[] = [
  { id: 1,  userId: 'USR-1042', name: 'Rahul Sharma',   mobile: '9876543210', amount: 5000,  method: 'UPI',       transactionId: 'TXN423981234', submittedAt: '10:32 AM', screenshotUrl: null, status: 'pending'  },
  { id: 2,  userId: 'USR-1039', name: 'Priya Patel',    mobile: '9812345678', amount: 2500,  method: 'QR Code',   transactionId: 'TXN512340987', submittedAt: '10:18 AM', screenshotUrl: null, status: 'pending'  },
  { id: 3,  userId: 'USR-1031', name: 'Anil Kumar',     mobile: '9988776655', amount: 10000, method: 'NEFT',      transactionId: 'TXN678901234', submittedAt: '09:45 AM', screenshotUrl: null, status: 'pending'  },
  { id: 4,  userId: 'USR-1028', name: 'Sneha Joshi',    mobile: '9123456789', amount: 1500,  method: 'UPI',       transactionId: 'TXN789012345', submittedAt: '09:12 AM', screenshotUrl: null, status: 'pending'  },
  { id: 5,  userId: 'USR-1022', name: 'Vikram Singh',   mobile: '9001234567', amount: 3000,  method: 'UPI',       transactionId: 'TXN891234567', submittedAt: '08:50 AM', screenshotUrl: null, status: 'approved' },
  { id: 6,  userId: 'USR-1018', name: 'Kavya Reddy',    mobile: '9887654321', amount: 500,   method: 'QR Code',   transactionId: 'TXN912345678', submittedAt: '08:30 AM', screenshotUrl: null, status: 'approved' },
  { id: 7,  userId: 'USR-1015', name: 'Mohan Das',      mobile: '9765432109', amount: 200,   method: 'UPI',       transactionId: 'TXN023456789', submittedAt: 'Yesterday', screenshotUrl: null, status: 'rejected', rejectionReason: 'Invalid screenshot' },
  { id: 8,  userId: 'USR-1010', name: 'Divya Nair',     mobile: '9654321098', amount: 7500,  method: 'NEFT/IMPS', transactionId: 'TXN134567890', submittedAt: 'Yesterday', screenshotUrl: null, status: 'approved' },
]

const REJECTION_REASONS = ['Invalid screenshot', 'Duplicate request', 'Wrong amount', 'Unreadable image', 'Other']

// ── Component ──────────────────────────────────────
export default function DepositApprove() {
  const [deposits,      setDeposits]      = useState<Deposit[]>(initialDeposits)
  const [activeTab,     setActiveTab]     = useState<FilterTab>('all')
  const [search,        setSearch]        = useState('')
  const [dateFilter,    setDateFilter]    = useState('All Date')
  const [selected,      setSelected]      = useState<number[]>([])
  const [previewId,     setPreviewId]     = useState<number | null>(null)
  const [rejectId,      setRejectId]      = useState<number | null>(null)
  const [rejectReason,  setRejectReason]  = useState(REJECTION_REASONS[0])

  // ── Derived ────────────────────────────────────
  const counts = useMemo(() => ({
    all:      deposits.length,
    pending:  deposits.filter(d => d.status === 'pending').length,
    approved: deposits.filter(d => d.status === 'approved').length,
    rejected: deposits.filter(d => d.status === 'rejected').length,
  }), [deposits])

  const totalPendingAmt  = deposits.filter(d => d.status === 'pending').reduce((s, d) => s + d.amount, 0)
  const totalApprovedAmt = deposits.filter(d => d.status === 'approved').reduce((s, d) => s + d.amount, 0)

  const filtered = useMemo(() => deposits.filter(d => {
    const matchTab    = activeTab === 'all' || d.status === activeTab
    const matchSearch = !search || d.userId.toLowerCase().includes(search.toLowerCase())
                     || d.name.toLowerCase().includes(search.toLowerCase())
                     || d.transactionId.toLowerCase().includes(search.toLowerCase())
                     || d.mobile.includes(search)
    return matchTab && matchSearch
  }), [deposits, activeTab, search])

  // ── Actions ────────────────────────────────────
  const approve = (id: number) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d))
    setSelected(prev => prev.filter(s => s !== id))
  }

  const rejectConfirm = () => {
    if (!rejectId) return
    setDeposits(prev => prev.map(d => d.id === rejectId ? { ...d, status: 'rejected', rejectionReason: rejectReason } : d))
    setSelected(prev => prev.filter(s => s !== rejectId))
    setRejectId(null)
  }

  const bulkApprove = () => {
    setDeposits(prev => prev.map(d => selected.includes(d.id) ? { ...d, status: 'approved' } : d))
    setSelected([])
  }

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(d => d.id))

  const previewDeposit = deposits.find(d => d.id === previewId)

  return (
    <div className="ac-root">
      
      <p className="ac-page-sub">Review and approve user payment requests</p>

      {/* ── Stat cards ─────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'bi-hourglass-split', cls: 'amber',  label: 'Pending',          value: counts.pending.toString()              },
          { icon: 'bi-check-circle',    cls: 'green',  label: 'Approved Today',   value: counts.approved.toString()             },
          { icon: 'bi-cash-stack',      cls: 'red',    label: 'Amount Pending',   value: `₹${totalPendingAmt.toLocaleString()}`  },
          { icon: 'bi-wallet2',         cls: 'teal',   label: 'Amount Credited',  value: `₹${totalApprovedAmt.toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
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
          {(['all', 'pending', 'approved', 'rejected'] as FilterTab[]).map(tab => (
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
              placeholder="Search by user, mobile or Txn ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="ac-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option>All Date</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
          </select>
          <span className="ac-results">{filtered.length} results</span>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="ac-bulk-bar">
            <i className="bi bi-check2-square" />
            {selected.length} selected
            <button className="ac-bulk-btn" onClick={bulkApprove}>
              <i className="bi bi-check-all me-1" />Approve Selected
            </button>
            <button className="ac-bulk-clear" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}

        {/* Table */}
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox" className="ac-checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>User</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Submitted</th>
                <th>Proof</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="ac-empty">
                      <div className="ac-empty-icon"><i className="bi bi-inbox" /></div>
                      <div className="ac-empty-title">No deposits found</div>
                      <div className="ac-empty-sub">Try adjusting your search or filter</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(dep => (
                <tr key={dep.id}>
                  <td>
                    <input type="checkbox" className="ac-checkbox"
                      checked={selected.includes(dep.id)}
                      onChange={() => toggleSelect(dep.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="ac-user-avatar">{dep.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{dep.name}</div>
                        <div className="muted">{dep.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{dep.mobile}</td>
                  <td>
                    <span className="mono" style={{ color: dep.status === 'approved' ? '#17c653' : '#071437' }}>
                      ₹{dep.amount.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{dep.method}</td>
                  <td className="mono">{dep.transactionId}</td>
                  <td className="muted">{dep.submittedAt}</td>
                  <td>
                    <button className="ac-btn view" onClick={() => setPreviewId(dep.id)}>
                      <i className="bi bi-image me-1" />View
                    </button>
                  </td>
                  <td>
                    <span className={`ac-badge ${dep.status}`}>
                      {dep.status === 'pending' ? '⏳ Pending'
                        : dep.status === 'approved' ? '✓ Approved'
                        : '✕ Rejected'}
                    </span>
                  </td>
                  <td>
                    {dep.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="ac-btn approve" onClick={() => approve(dep.id)}>Approve</button>
                        <button className="ac-btn reject"  onClick={() => { setRejectId(dep.id); setRejectReason(REJECTION_REASONS[0]) }}>Reject</button>
                      </div>
                    ) : dep.status === 'rejected' ? (
                      <span style={{ fontSize: 11, color: '#99a1b7' }}>{dep.rejectionReason}</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#99a1b7' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Screenshot preview modal ─────────── */}
      {previewDeposit && (
        <div className="ac-modal-backdrop" onClick={() => setPreviewId(null)}>
          <div className="ac-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h5 className="ac-modal-title">Payment Proof — {previewDeposit.userId}</h5>
              <button className="ac-modal-close" onClick={() => setPreviewId(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="ac-modal-body">
              {/* Screenshot */}
              {previewDeposit.screenshotUrl ? (
                <img src={previewDeposit.screenshotUrl} alt="Payment proof" className="ac-screenshot-img" />
              ) : (
                <div className="ac-screenshot-placeholder">
                  <i className="bi bi-image" style={{ fontSize: 36 }} />
                  <span style={{ fontSize: 13 }}>No screenshot uploaded</span>
                </div>
              )}
              {/* Details */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="ac-modal-row"><span className="ac-modal-row-label">Name</span><span className="ac-modal-row-val">{previewDeposit.name}</span></div>
                <div className="ac-modal-row"><span className="ac-modal-row-label">Amount</span><span className="ac-modal-row-val" style={{ color: '#17c653' }}>₹{previewDeposit.amount.toLocaleString()}</span></div>
                <div className="ac-modal-row"><span className="ac-modal-row-label">Method</span><span className="ac-modal-row-val">{previewDeposit.method}</span></div>
                <div className="ac-modal-row"><span className="ac-modal-row-label">Transaction ID</span><span className="ac-modal-row-val">{previewDeposit.transactionId}</span></div>
                <div className="ac-modal-row"><span className="ac-modal-row-label">Submitted</span><span className="ac-modal-row-val">{previewDeposit.submittedAt}</span></div>
              </div>
            </div>
            {previewDeposit.status === 'pending' && (
              <div className="ac-modal-footer">
                <button className="ac-modal-cancel" onClick={() => { setPreviewId(null); setRejectId(previewDeposit.id); setRejectReason(REJECTION_REASONS[0]) }}>
                  Reject
                </button>
                <button className="ac-modal-confirm" onClick={() => { approve(previewDeposit.id); setPreviewId(null) }}>
                  <i className="bi bi-check-lg me-1" />Approve ₹{previewDeposit.amount.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Rejection reason modal ───────────── */}
      {rejectId && (
        <div className="ac-modal-backdrop" onClick={() => setRejectId(null)}>
          <div className="ac-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="ac-modal-header">
              <h5 className="ac-modal-title">Reject Deposit</h5>
              <button className="ac-modal-close" onClick={() => setRejectId(null)}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="ac-modal-body">
              <p style={{ fontSize: 13, color: '#99a1b7', marginBottom: 16 }}>
                Select a reason for rejecting this deposit. The user will be notified.
              </p>
              <div className="ac-modal-field">
                <label className="ac-modal-label">Rejection Reason</label>
                <select
                  className="ac-modal-input"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                >
                  {REJECTION_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="ac-modal-footer">
              <button className="ac-modal-cancel" onClick={() => setRejectId(null)}>Cancel</button>
              <button className="ac-modal-confirm danger" onClick={rejectConfirm}>
                <i className="bi bi-x-lg me-1" />Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}