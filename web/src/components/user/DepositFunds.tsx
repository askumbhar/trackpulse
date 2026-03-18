// src/components/user/DepositFund.tsx
import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DepositForm {
  amount: string;
  transactionId: string;
  paymentMethod: string;
  notes: string;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .df-root {
    font-family: 'DM Sans', sans-serif;
    background: #0f1117;
    min-height: 100vh;
    padding: 24px;
    color: #e2e8f0;
  }

  .df-page-title { font-size: 18px; font-weight: 700; color: #f1f5f9; margin: 0 0 2px; }
  .df-page-sub   { font-size: 12px; color: #475569; margin: 0 0 24px; }

  /* Panel */
  .df-panel {
    background: #151929;
    border: 1px solid #1e2640;
    border-radius: 12px;
    overflow: hidden;
  }
  .df-panel-header {
    background: #1a1f30;
    border-bottom: 1px solid #1e2640;
    padding: 14px 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .df-panel-body { padding: 20px; }

  /* QR box */
  .df-qr-box {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .df-qr-placeholder {
    width: 160px; height: 160px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
  }
  .df-qr-label {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
    text-align: center;
  }
  .df-qr-upi {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #64748b;
    background: #f1f5f9;
    padding: 4px 12px;
    border-radius: 6px;
  }
  .df-qr-note {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    line-height: 1.5;
    background: #1a1f30;
    border-radius: 8px;
    padding: 10px 14px;
    border: 1px solid #1e2640;
  }

  /* Form labels + inputs */
  .df-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
    display: block;
  }
  .df-input {
    width: 100%;
    background: #0f1117;
    border: 1px solid #1e2640;
    border-radius: 8px;
    color: #f1f5f9;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .df-input:focus {
    border-color: #1b84ff;
    box-shadow: 0 0 0 3px rgba(27,132,255,0.12);
  }
  .df-input::placeholder { color: #334155; }
  .df-input-prefix {
    position: relative;
  }
  .df-input-prefix .prefix {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    pointer-events: none;
  }
  .df-input-prefix .df-input { padding-left: 28px; }

  select.df-input option { background: #1a1f30; }

  /* Upload zone */
  .df-upload-zone {
    border: 2px dashed #1e2640;
    border-radius: 10px;
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .df-upload-zone:hover,
  .df-upload-zone.drag-over {
    border-color: #1b84ff;
    background: rgba(27,132,255,0.04);
  }
  .df-upload-zone input[type="file"] {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .df-upload-icon {
    font-size: 2rem;
    color: #334155;
    margin-bottom: 10px;
    display: block;
    transition: color 0.2s;
  }
  .df-upload-zone:hover .df-upload-icon,
  .df-upload-zone.drag-over .df-upload-icon { color: #1b84ff; }
  .df-upload-title {
    font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 4px;
  }
  .df-upload-sub {
    font-size: 11px; color: #475569;
  }
  .df-upload-sub span { color: #1b84ff; font-weight: 600; }

  /* Preview */
  .df-preview {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #1e2640;
  }
  .df-preview img {
    width: 100%; max-height: 220px;
    object-fit: contain;
    background: #0f1117;
    display: block;
  }
  .df-preview-bar {
    background: #1a1f30;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .df-preview-name {
    font-size: 12px; color: #94a3b8;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-family: 'DM Mono', monospace;
  }
  .df-preview-size { font-size: 11px; color: #475569; white-space: nowrap; }
  .df-remove-btn {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 6px;
    color: #ef4444;
    font-size: 12px;
    padding: 3px 10px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .df-remove-btn:hover { background: rgba(239,68,68,0.2); }

  /* Accepted formats */
  .df-formats {
    display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;
  }
  .df-format-pill {
    font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 4px;
    background: rgba(255,255,255,0.05);
    color: #64748b;
    border: 1px solid #1e2640;
  }

  /* Submit button */
  .df-submit-btn {
    width: 100%;
    background: #1b84ff;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.02em;
  }
  .df-submit-btn:hover  { background: #3b99ff; }
  .df-submit-btn:active { transform: scale(0.98); }
  .df-submit-btn:disabled {
    background: #1e2640; color: #475569; cursor: not-allowed;
  }

  /* Success state */
  .df-success {
    text-align: center;
    padding: 40px 20px;
  }
  .df-success-icon {
    font-size: 3rem;
    color: #10b981;
    display: block;
    margin-bottom: 16px;
    animation: pop 0.4s ease;
  }
  @keyframes pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1);   opacity: 1; }
  }
  .df-success h5 { color: #f1f5f9; font-weight: 700; margin-bottom: 8px; }
  .df-success p  { color: #64748b; font-size: 13px; }

  /* Validation error */
  .df-error {
    font-size: 11px; color: #ef4444; margin-top: 5px;
    display: flex; align-items: center; gap: 4px;
  }

  /* Info tip */
  .df-info-tip {
    background: rgba(27,132,255,0.08);
    border: 1px solid rgba(27,132,255,0.15);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #93c5fd;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE  = 5 * 1024 * 1024; // 5 MB

// ── Component ─────────────────────────────────────────────────────────────────
export default function DepositFund() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<DepositForm>({
    amount: "",
    transactionId: "",
    paymentMethod: "upi",
    notes: "",
  });

  const [file,       setFile]       = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [dragOver,   setDragOver]   = useState(false);
  const [errors,     setErrors]     = useState<Partial<DepositForm & { file: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const processFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      setErrors((prev) => ({ ...prev, file: "Only JPG, PNG, WEBP or PDF allowed." }));
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrors((prev) => ({ ...prev, file: "File must be under 5 MB." }));
      return;
    }
    setFile(f);
    setErrors((prev) => ({ ...prev, file: "" }));

    if (f.type !== "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null); // PDF — no image preview
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = "Enter a valid deposit amount.";
    if (!form.transactionId.trim())
      errs.transactionId = "Transaction ID is required.";
    if (!file)
      errs.file = "Please upload your payment screenshot or receipt.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);

    // Build FormData for your .NET API
    const formData = new FormData();
    formData.append("amount",          form.amount);
    formData.append("transactionId",   form.transactionId);
    formData.append("paymentMethod",   form.paymentMethod);
    formData.append("notes",           form.notes);
    formData.append("receiptFile",     file!);   // ← image/PDF goes here

    // Replace with your actual API call:
    // await api.post("/api/deposits", formData);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="df-root">
          <div className="df-panel" style={{ maxWidth: 480, margin: "0 auto" }}>
            <div className="df-success">
              <i className="bi bi-check-circle-fill df-success-icon" />
              <h5>Deposit Request Submitted!</h5>
              <p>
                Your payment screenshot has been uploaded.<br />
                Our team will verify and approve within <strong style={{ color: "#f1f5f9" }}>1–2 hours</strong>.
              </p>
              <button
                className="df-submit-btn mt-3"
                style={{ maxWidth: 200, margin: "16px auto 0" }}
                onClick={() => { setSubmitted(false); setForm({ amount: "", transactionId: "", paymentMethod: "upi", notes: "" }); removeFile(); }}
              >
                <i className="bi bi-plus" /> New Deposit
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="df-root">

        <h4 className="df-page-title">Deposit Funds</h4>
        <p className="df-page-sub">Scan the QR, pay, then upload your payment proof below</p>

        <div className="row g-4" style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* ── Left: QR Code ──────────────────────── */}
          <div className="col-12 col-md-5">
            <div className="df-panel h-100">
              <div className="df-panel-header">
                <i className="bi bi-qr-code" /> Payment QR
              </div>
              <div className="df-panel-body">
                <div className="df-qr-box">
                  {/* Replace with your actual QR image */}
                  <div className="df-qr-placeholder">📱</div>
                  <div className="df-qr-label">Scan to Pay</div>
                  <div className="df-qr-upi">trackpulse@upi</div>
                </div>

                <div className="df-qr-note mt-3">
                  <i className="bi bi-info-circle me-1" />
                  After completing the payment, fill in the form and upload your screenshot or transaction receipt.
                </div>

                {/* Accepted formats */}
                <div className="mt-3">
                  <div className="df-label">Accepted File Types</div>
                  <div className="df-formats">
                    {["JPG", "PNG", "WEBP", "PDF"].map((f) => (
                      <span key={f} className="df-format-pill">{f}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Max size: 5 MB</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────── */}
          <div className="col-12 col-md-7">
            <div className="df-panel">
              <div className="df-panel-header">
                <i className="bi bi-upload" /> Payment Details
              </div>
              <div className="df-panel-body d-flex flex-column gap-3">

                {/* Amount */}
                <div>
                  <label className="df-label">Deposit Amount</label>
                  <div className="df-input-prefix">
                    <span className="prefix">₹</span>
                    <input
                      className="df-input"
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleChange}
                      min={1}
                    />
                  </div>
                  {errors.amount && (
                    <div className="df-error">
                      <i className="bi bi-exclamation-circle" />{errors.amount}
                    </div>
                  )}
                </div>

                {/* Payment method */}
                <div>
                  <label className="df-label">Payment Method</label>
                  <select
                    className="df-input"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="upi">UPI</option>
                    <option value="qr">QR Code</option>
                    <option value="neft">NEFT / IMPS</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="df-label">Transaction ID / UTR Number</label>
                  <input
                    className="df-input"
                    type="text"
                    name="transactionId"
                    placeholder="e.g. 423981234567"
                    value={form.transactionId}
                    onChange={handleChange}
                  />
                  {errors.transactionId && (
                    <div className="df-error">
                      <i className="bi bi-exclamation-circle" />{errors.transactionId}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="df-label">Notes <span style={{ color: "#334155", fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    className="df-input"
                    name="notes"
                    placeholder="Any additional info..."
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Upload zone */}
                <div>
                  <label className="df-label">Payment Screenshot / Receipt</label>

                  {!file ? (
                    <div
                      className={`df-upload-zone ${dragOver ? "drag-over" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <i className="bi bi-cloud-arrow-up df-upload-icon" />
                      <div className="df-upload-title">Drag & drop or click to upload</div>
                      <div className="df-upload-sub">
                        <span>Browse file</span> — JPG, PNG, WEBP, PDF up to 5 MB
                      </div>
                    </div>
                  ) : (
                    // Preview
                    <div className="df-preview">
                      {preview ? (
                        <img src={preview} alt="Payment proof" />
                      ) : (
                        // PDF fallback
                        <div style={{ background: "#1a1f30", padding: "24px", textAlign: "center" }}>
                          <i className="bi bi-file-earmark-pdf" style={{ fontSize: 40, color: "#ef4444" }} />
                          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8 }}>PDF Document</div>
                        </div>
                      )}
                      <div className="df-preview-bar">
                        <span className="df-preview-name">{file.name}</span>
                        <span className="df-preview-size">{formatBytes(file.size)}</span>
                        <button className="df-remove-btn" onClick={removeFile}>
                          <i className="bi bi-x me-1" />Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.file && (
                    <div className="df-error mt-1">
                      <i className="bi bi-exclamation-circle" />{errors.file}
                    </div>
                  )}
                </div>

                {/* Info tip */}
                <div className="df-info-tip">
                  <i className="bi bi-shield-check" style={{ flexShrink: 0, marginTop: 1 }} />
                  Your deposit will be reviewed and credited within 1–2 hours after admin verification.
                </div>

                {/* Submit */}
                <button
                  className="df-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send" />
                      Submit Deposit Request
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}