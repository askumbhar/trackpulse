// src/components/user/DepositFunds.tsx
import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import '../../styles/DepositFunds.css'

interface DepositForm {
  amount: string
  transactionId: string
  paymentMethod: string
  notes: string
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE  = 5 * 1024 * 1024

export default function DepositFunds() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<DepositForm>({
    amount: '', transactionId: '', paymentMethod: 'upi', notes: '',
  })
  const [file,       setFile]       = useState<File | null>(null)
  const [preview,    setPreview]    = useState<string | null>(null)
  const [dragOver,   setDragOver]   = useState(false)
  const [errors,     setErrors]     = useState<Partial<DepositForm & { file: string }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const processFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      setErrors(prev => ({ ...prev, file: 'Only JPG, PNG, WEBP or PDF allowed.' })); return
    }
    if (f.size > MAX_SIZE) {
      setErrors(prev => ({ ...prev, file: 'File must be under 5 MB.' })); return
    }
    setFile(f)
    setErrors(prev => ({ ...prev, file: '' }))
    if (f.type !== 'application/pdf') {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target?.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) processFile(f)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files?.[0]; if (f) processFile(f)
  }

  const removeFile = () => {
    setFile(null); setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const errs: typeof errors = {}
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid deposit amount.'
    if (!form.transactionId.trim())
      errs.transactionId = 'Transaction ID is required.'
    if (!file)
      errs.file = 'Please upload your payment screenshot or receipt.'
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    const formData = new FormData()
    formData.append('amount',        form.amount)
    formData.append('transactionId', form.transactionId)
    formData.append('paymentMethod', form.paymentMethod)
    formData.append('notes',         form.notes)
    formData.append('receiptFile',   file!)
    // await axios.post('/api/deposits', formData)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false); setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm({ amount: '', transactionId: '', paymentMethod: 'upi', notes: '' })
    removeFile()
  }

  if (submitted) return (
    <div className="df-root">
      <div className="df-panel" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="df-success">
          <i className="bi bi-check-circle-fill df-success-icon" />
          <h5>Deposit Request Submitted!</h5>
          <p>Your payment screenshot has been uploaded.<br />
            Our team will verify within <strong>1–2 hours</strong>.</p>
          <button className="df-submit-btn mt-3" style={{ maxWidth: 200, margin: '16px auto 0' }} onClick={resetForm}>
            <i className="bi bi-plus" /> New Deposit
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="df-root">
     
      <p className="df-page-sub">Scan the QR, pay, then upload your payment proof below</p>

      <div className="row g-4" style={{ maxWidth: 900 }}>

        {/* QR panel */}
        <div className="col-12 col-md-5">
          <div className="df-panel h-100">
            <div className="df-panel-header"><i className="bi bi-qr-code" /> Payment QR</div>
            <div className="df-panel-body">
              <div className="df-qr-box">
                <div className="df-qr-placeholder">📱</div>
                <div className="df-qr-label">Scan to Pay</div>
                <div className="df-qr-upi">trackpulse@upi</div>
              </div>
              <div className="df-qr-note mt-3">
                <i className="bi bi-info-circle me-1" />
                After payment, fill in the form and upload your screenshot or receipt.
              </div>
              <div className="mt-3">
                <div className="df-label">Accepted File Types</div>
                <div className="df-formats">
                  {['JPG', 'PNG', 'WEBP', 'PDF'].map(f => (
                    <span key={f} className="df-format-pill">{f}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>Max size: 5 MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="col-12 col-md-7">
          <div className="df-panel">
            <div className="df-panel-header"><i className="bi bi-upload" /> Payment Details</div>
            <div className="df-panel-body d-flex flex-column gap-3">

              <div>
                <label className="df-label">Deposit Amount</label>
                <div className="df-input-prefix">
                  <span className="prefix">₹</span>
                  <input className="df-input" type="number" name="amount" placeholder="0.00"
                    value={form.amount} onChange={handleChange} min={1} />
                </div>
                {errors.amount && <div className="df-error"><i className="bi bi-exclamation-circle" />{errors.amount}</div>}
              </div>

              <div>
                <label className="df-label">Payment Method</label>
                <select className="df-input" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  <option value="upi">UPI</option>
                  <option value="qr">QR Code</option>
                  <option value="neft">NEFT / IMPS</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="df-label">Transaction ID / UTR Number</label>
                <input className="df-input" type="text" name="transactionId"
                  placeholder="e.g. 423981234567" value={form.transactionId} onChange={handleChange} />
                {errors.transactionId && <div className="df-error"><i className="bi bi-exclamation-circle" />{errors.transactionId}</div>}
              </div>

              <div>
                <label className="df-label">Notes <span style={{ color: '#334155', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="df-input" name="notes" placeholder="Any additional info..."
                  value={form.notes} onChange={handleChange} rows={2} style={{ resize: 'none' }} />
              </div>

              <div>
                <label className="df-label">Payment Screenshot / Receipt</label>
                {!file ? (
                  <div
                    className={`df-upload-zone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={handleFileChange} style={{ display: 'none' }} />
                    <i className="bi bi-cloud-arrow-up df-upload-icon" />
                    <div className="df-upload-title">Drag & drop or click to upload</div>
                    <div className="df-upload-sub"><span>Browse file</span> — JPG, PNG, WEBP, PDF up to 5 MB</div>
                  </div>
                ) : (
                  <div className="df-preview">
                    {preview
                      ? <img src={preview} alt="Payment proof" />
                      : <div style={{ background: '#1a1f30', padding: 24, textAlign: 'center' }}>
                          <i className="bi bi-file-earmark-pdf" style={{ fontSize: 40, color: '#ef4444' }} />
                          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>PDF Document</div>
                        </div>
                    }
                    <div className="df-preview-bar">
                      <span className="df-preview-name">{file.name}</span>
                      <span className="df-preview-size">{formatBytes(file.size)}</span>
                      <button className="df-remove-btn" onClick={removeFile}>
                        <i className="bi bi-x me-1" />Remove
                      </button>
                    </div>
                  </div>
                )}
                {errors.file && <div className="df-error mt-1"><i className="bi bi-exclamation-circle" />{errors.file}</div>}
              </div>

              <div className="df-info-tip">
                <i className="bi bi-shield-check" style={{ flexShrink: 0, marginTop: 1 }} />
                Your deposit will be reviewed and credited within 1–2 hours after admin verification.
              </div>

              <button className="df-submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm" /> Submitting...</>
                  : <><i className="bi bi-send" /> Submit Deposit Request</>
                }
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
