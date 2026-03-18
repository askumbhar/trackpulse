// src/components/admin/DepositApprove.tsx
import { useState } from 'react'
import '../../styles/OddsManager.css'   // reuses deposit row styles already in OddsManager.css

const initialDeposits = [
  { userId: 'User 101', amount:  450.00, status: 'pending' },
  { userId: 'User 102', amount:  330.00, status: 'pending' },
  { userId: 'User 103', amount:  356.00, status: 'pending' },
]

type DepositStatus = 'pending' | 'approved' | 'rejected'

interface Deposit {
  userId: string
  amount: number
  status: DepositStatus
}

export default function DepositApprove() {
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits)

  const handle = (userId: string, action: DepositStatus) => {
    setDeposits(prev => prev.map(d => d.userId === userId ? { ...d, status: action } : d))
  }

  return (
    <div className="p-2">

      {/* Column labels */}
      <div style={{ display: 'flex', padding: '6px 16px', borderBottom: '1px solid #1e2640', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>User ID</span>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 80, textAlign: 'right' }}>Amount</span>
        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 140, textAlign: 'right' }}>Action</span>
      </div>

      {deposits.map(dep => (
        <div className="deposit-row" key={dep.userId}>
          <span className="deposit-user">{dep.userId}</span>
          <span className={`deposit-amount ${dep.amount >= 0 ? 'positive' : 'negative'}`}>
            +₹{Math.abs(dep.amount).toFixed(2)}
          </span>
          <div className="deposit-actions">
            {dep.status === 'pending' ? (
              <>
                <button className="approve-btn" onClick={() => handle(dep.userId, 'approved')}>APPROVE</button>
                <button className="reject-btn"  onClick={() => handle(dep.userId, 'rejected')}>REJECT</button>
              </>
            ) : dep.status === 'approved' ? (
              <span className="deposit-badge-approve">✓ Approved</span>
            ) : (
              <span className="deposit-badge-reject">✕ Rejected</span>
            )}
          </div>
        </div>
      ))}

    </div>
  )
}
