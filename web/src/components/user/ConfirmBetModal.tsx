// src/components/user/ConfirmBetModal.tsx
import '../../styles/Modal.css'

interface Props {
  horse: string
  betType: 'win' | 'place'
  odds: number
  stake: number
  payout: number
  raceName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmBetModal({ horse, betType, odds, stake, payout, raceName, onConfirm, onCancel }: Props) {
  return (
    // Backdrop
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title">Confirm Your Bet?</h5>
          <button className="modal-close" onClick={onCancel}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-detail-row">
            <span className="modal-detail-label">Race</span>
            <span className="modal-detail-value">{raceName}</span>
          </div>
          <div className="modal-detail-row">
            <span className="modal-detail-label">Horse</span>
            <span className="modal-detail-value">{horse}</span>
          </div>
          <div className="modal-detail-row">
            <span className="modal-detail-label">Bet Type</span>
            <span className="modal-detail-value" style={{ textTransform: 'capitalize' }}>{betType}</span>
          </div>
          <div className="modal-detail-row">
            <span className="modal-detail-label">Odds</span>
            <span className="modal-detail-value">{odds}</span>
          </div>
          <div className="modal-detail-row">
            <span className="modal-detail-label">Stake</span>
            <span className="modal-detail-value">₹{stake}</span>
          </div>
          <div className="modal-divider" />
          <div className="modal-detail-row">
            <span className="modal-detail-label" style={{ fontWeight: 700, color: '#071437' }}>Potential Return</span>
            <span className="modal-payout">₹{payout}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn-confirm" onClick={onConfirm}>
            Confirm & Place
          </button>
        </div>

      </div>
    </div>
  )
}