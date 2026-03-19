// src/components/admin/RaceStreamManager.tsx
// ─────────────────────────────────────────────────────
// Admin panel to manage race streams.
// Add new YouTube links, set status, pin featured stream,
// toggle visibility, edit and delete.
//
// In production:
//   GET    /api/streams        → load all streams
//   POST   /api/streams        → add stream
//   PUT    /api/streams/:id    → edit/toggle/pin
//   DELETE /api/streams/:id    → delete stream
// ─────────────────────────────────────────────────────
import { useState, useMemo } from 'react'
import {
  mockStreams,
  extractYoutubeId,
  getThumbnailUrl,
  type Stream,
  type StreamStatus,
} from '../shared/RaceStream'
import '../../styles/RaceStream.css'

// ── Helpers ────────────────────────────────────────
function isValidYoutubeUrl(url: string): boolean {
  return !!extractYoutubeId(url)
}

const EMPTY_FORM = {
  title:       '',
  description: '',
  youtubeUrl:  '',
  status:      'live' as StreamStatus,
  raceName:    '',
  venue:       '',
  scheduledAt: '',
}

// ── Component ──────────────────────────────────────
export default function RaceStreamManager() {
  const [streams,    setStreams]    = useState<Stream[]>(mockStreams)
  const [form,       setForm]       = useState({ ...EMPTY_FORM })
  const [editId,     setEditId]     = useState<number | null>(null)
  const [deleteId,   setDeleteId]   = useState<number | null>(null)
  const [formOpen,   setFormOpen]   = useState(true)
  const [urlError,   setUrlError]   = useState('')

  // stats
  const counts = useMemo(() => ({
    total:    streams.length,
    live:     streams.filter(s => s.status === 'live').length,
    upcoming: streams.filter(s => s.status === 'upcoming').length,
    recorded: streams.filter(s => s.status === 'recorded').length,
    hidden:   streams.filter(s => !s.visible).length,
  }), [streams])

  // ── Form handlers ──────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'youtubeUrl') setUrlError('')
  }

  const startEdit = (stream: Stream) => {
    setForm({
      title:       stream.title,
      description: stream.description,
      youtubeUrl:  stream.youtubeUrl,
      status:      stream.status,
      raceName:    stream.raceName,
      venue:       stream.venue,
      scheduledAt: stream.scheduledAt,
    })
    setEditId(stream.id)
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setForm({ ...EMPTY_FORM })
    setEditId(null)
    setUrlError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim())      return
    if (!form.youtubeUrl.trim()) return

    if (!isValidYoutubeUrl(form.youtubeUrl)) {
      setUrlError('Please enter a valid YouTube URL.')
      return
    }

    if (editId !== null) {
      // Update existing
      setStreams(prev => prev.map(s =>
        s.id === editId
          ? { ...s, ...form }
          : s
      ))
      setEditId(null)
    } else {
      // Add new
      const newStream: Stream = {
        id:      Date.now(),
        pinned:  false,
        visible: true,
        ...form,
      }
      setStreams(prev => [newStream, ...prev])
    }
    setForm({ ...EMPTY_FORM })
    setUrlError('')
  }

  // ── Stream actions ─────────────────────────────
  const toggleVisible = (id: number) =>
    setStreams(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))

  const togglePin = (id: number) =>
    setStreams(prev => prev.map(s => ({
      ...s,
      // unpin all others, pin selected (toggle if already pinned)
      pinned: s.id === id ? !s.pinned : false,
    })))

  const confirmDelete = () => {
    if (deleteId === null) return
    setStreams(prev => prev.filter(s => s.id !== deleteId))
    setDeleteId(null)
  }

  const urlValid   = form.youtubeUrl ? isValidYoutubeUrl(form.youtubeUrl) : null
  const thumbPreview = form.youtubeUrl ? getThumbnailUrl(form.youtubeUrl) : null
  const deleteTarget = streams.find(s => s.id === deleteId)

  return (
    <div className="rsm-root">
      
      <p className="rsm-page-sub">Add YouTube links for live races, previews and replays. Control what users see.</p>

      {/* ── Stat cards ─────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { icon: 'bi-collection-play', cls: 'blue',  label: 'Total Streams', value: counts.total    },
          { icon: 'bi-broadcast',       cls: 'red',   label: 'Live Now',      value: counts.live     },
          { icon: 'bi-clock',           cls: 'amber', label: 'Upcoming',      value: counts.upcoming },
          { icon: 'bi-camera-video',    cls: 'teal',  label: 'Recorded',      value: counts.recorded },
          { icon: 'bi-eye-slash',       cls: 'purple',label: 'Hidden',        value: counts.hidden   },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-4 col-xl-2">
            <div style={{
              background: '#fff', border: '1px solid #f1f1f4', borderRadius: 12,
              padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0,
                background: s.cls === 'blue' ? 'rgba(27,132,255,0.1)' : s.cls === 'red' ? 'rgba(248,40,90,0.1)' :
                  s.cls === 'amber' ? 'rgba(246,177,0,0.1)' : s.cls === 'teal' ? 'rgba(20,184,166,0.1)' : 'rgba(120,80,255,0.1)',
                color: s.cls === 'blue' ? '#1b84ff' : s.cls === 'red' ? '#f8285a' :
                  s.cls === 'amber' ? '#f6b100' : s.cls === 'teal' ? '#14b8a6' : '#7850ff',
              }}>
                <i className={`bi ${s.icon}`} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#99a1b7', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#071437', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit form ─────────────────────── */}
      <div className="rsm-form-panel">
        <div className="rsm-form-header">
          <h5 className="rsm-form-title">
            {editId !== null ? '✏️ Edit Stream' : '➕ Add New Stream'}
          </h5>
          <button
            onClick={() => setFormOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#99a1b7', fontSize: 16 }}
          >
            <i className={`bi bi-chevron-${formOpen ? 'up' : 'down'}`} />
          </button>
        </div>

        {formOpen && (
          <form className="rsm-form-body" onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* YouTube URL */}
              <div className="col-12">
                <label className="rsm-label">YouTube URL *</label>
                <input
                  className="rsm-input"
                  name="youtubeUrl"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={form.youtubeUrl}
                  onChange={handleChange}
                  required
                />
                {/* URL validation feedback */}
                {form.youtubeUrl && (
                  <div className={`rsm-preview-strip ${urlValid ? '' : 'error'}`}>
                    {urlValid ? (
                      <>
                        <i className="bi bi-check-circle-fill" />
                        Valid YouTube URL — ID: {extractYoutubeId(form.youtubeUrl)}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-exclamation-circle-fill" />
                        Not a valid YouTube URL
                      </>
                    )}
                  </div>
                )}
                {urlError && (
                  <div className="rsm-preview-strip error" style={{ marginTop: 4 }}>
                    <i className="bi bi-exclamation-circle-fill" />{urlError}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="col-12 col-md-8">
                <label className="rsm-label">Stream Title *</label>
                <input
                  className="rsm-input"
                  name="title"
                  placeholder="e.g. Ascot Classic — Race #104 LIVE"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status */}
              <div className="col-12 col-md-4">
                <label className="rsm-label">Status *</label>
                <select className="rsm-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="live">🔴 Live</option>
                  <option value="upcoming">⏰ Upcoming</option>
                  <option value="recorded">▶ Recorded</option>
                </select>
              </div>

              {/* Race name */}
              <div className="col-12 col-md-4">
                <label className="rsm-label">Race Name</label>
                <input
                  className="rsm-input"
                  name="raceName"
                  placeholder="e.g. Ascot Classic"
                  value={form.raceName}
                  onChange={handleChange}
                />
              </div>

              {/* Venue */}
              <div className="col-12 col-md-4">
                <label className="rsm-label">Venue</label>
                <input
                  className="rsm-input"
                  name="venue"
                  placeholder="e.g. Ascot · Race #104"
                  value={form.venue}
                  onChange={handleChange}
                />
              </div>

              {/* Scheduled at */}
              <div className="col-12 col-md-4">
                <label className="rsm-label">Date / Time</label>
                <input
                  className="rsm-input"
                  name="scheduledAt"
                  placeholder="e.g. Today 15:30 or Mar 20, 2026"
                  value={form.scheduledAt}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="rsm-label">Description</label>
                <textarea
                  className="rsm-textarea"
                  name="description"
                  placeholder="Short description shown below the video player..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              {/* Thumbnail preview */}
              {thumbPreview && urlValid && (
                <div className="col-12">
                  <label className="rsm-label">Thumbnail Preview</label>
                  <img
                    src={thumbPreview}
                    alt="YouTube thumbnail"
                    style={{ height: 90, borderRadius: 8, border: '1px solid #f1f1f4', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="col-12" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="rsm-submit-btn" type="submit">
                  <i className={`bi bi-${editId !== null ? 'check-lg' : 'plus-lg'}`} />
                  {editId !== null ? 'Save Changes' : 'Add Stream'}
                </button>
                {editId !== null && (
                  <button type="button" onClick={cancelEdit}
                    style={{ background: '#f5f8fa', border: '1px solid #f1f1f4', borderRadius: 8, color: '#99a1b7', fontSize: 13, fontWeight: 600, padding: '9px 18px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </form>
        )}
      </div>

      {/* ── Stream list ─────────────────────────── */}
      <div className="rsm-panel">
        <div className="rsm-panel-header">
          <h5 className="rsm-panel-title">All Streams ({streams.length})</h5>
          <span style={{ fontSize: 12, color: '#99a1b7' }}>
            Toggle visibility to show/hide from users · Pin to feature in player
          </span>
        </div>

        <div className="rsm-table-wrap">
          <table className="rsm-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Thumb</th>
                <th>Title</th>
                <th>Venue</th>
                <th>Time</th>
                <th>Status</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="rsm-empty">
                      <i className="bi bi-collection-play" />
                      <div className="rsm-empty-title">No streams added yet</div>
                      <div className="rsm-empty-sub">Use the form above to add your first race stream.</div>
                    </div>
                  </td>
                </tr>
              ) : streams.map(stream => (
                <tr key={stream.id} style={{ opacity: stream.visible ? 1 : 0.5 }}>

                  {/* Thumbnail */}
                  <td>
                    <div style={{ width: 72, height: 40, borderRadius: 6, overflow: 'hidden', background: '#1a1f30', flexShrink: 0, position: 'relative' }}>
                      {getThumbnailUrl(stream.youtubeUrl) ? (
                        <img
                          src={getThumbnailUrl(stream.youtubeUrl)}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>
                          <i className="bi bi-play-circle" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {stream.pinned && <span title="Pinned as featured">📌</span>}
                      {stream.title}
                    </div>
                    <div className="mono">{extractYoutubeId(stream.youtubeUrl) ? `youtube.com/watch?v=${extractYoutubeId(stream.youtubeUrl)}` : stream.youtubeUrl}</div>
                  </td>

                  <td style={{ fontSize: 12, color: '#99a1b7' }}>{stream.venue || '—'}</td>
                  <td style={{ fontSize: 12, color: '#99a1b7', whiteSpace: 'nowrap' }}>{stream.scheduledAt || '—'}</td>

                  {/* Status badge */}
                  <td>
                    <span className={`rsm-badge ${stream.status}`}>
                      {stream.status === 'live' ? '● Live' : stream.status === 'upcoming' ? '⏰ Upcoming' : '▶ Recorded'}
                    </span>
                  </td>

                  {/* Visible toggle */}
                  <td>
                    <label className="rsm-toggle">
                      <input
                        type="checkbox"
                        checked={stream.visible}
                        onChange={() => toggleVisible(stream.id)}
                      />
                      <span className="rsm-toggle-track" />
                      <span className="rsm-toggle-thumb" />
                    </label>
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        className={`rsm-btn ${stream.pinned ? 'pinned' : 'pin'}`}
                        title={stream.pinned ? 'Unpin featured' : 'Pin as featured'}
                        onClick={() => togglePin(stream.id)}
                      >
                        <i className="bi bi-pin" />
                      </button>
                      <button
                        className="rsm-btn edit"
                        title="Edit stream"
                        onClick={() => startEdit(stream)}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="rsm-btn delete"
                        title="Delete stream"
                        onClick={() => setDeleteId(stream.id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete confirmation modal ───────────── */}
      {deleteId !== null && deleteTarget && (
        <div className="rsm-modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="rsm-modal" onClick={e => e.stopPropagation()}>
            <div className="rsm-modal-header">
              <h5 className="rsm-modal-title">Delete Stream?</h5>
              <button className="rsm-modal-close" onClick={() => setDeleteId(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="rsm-modal-body">
              Are you sure you want to delete <strong style={{ color: '#071437' }}>{deleteTarget.title}</strong>?
              This will immediately remove it from the user-facing stream list.
            </div>
            <div className="rsm-modal-footer">
              <button className="rsm-modal-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="rsm-modal-delete" onClick={confirmDelete}>
                <i className="bi bi-trash me-1" />Delete Stream
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}