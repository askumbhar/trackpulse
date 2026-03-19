// src/components/common/RaceStream.tsx
// ─────────────────────────────────────────────────────
// Shared viewer for both User and Admin.
// Shows the featured/pinned stream in a big 16:9 player,
// then a scrollable list of all active streams below.
//
// Usage (user page):    <RaceStream />
// Usage (admin page):   <RaceStream />  (same component)
//
// Admin manages streams via RaceStreamManager component.
// In production replace `mockStreams` with an API call.
// ─────────────────────────────────────────────────────
import { useState, useMemo } from 'react'
import '../../styles/RaceStream.css'

export type StreamStatus = 'live' | 'upcoming' | 'recorded'

export interface Stream {
  id: number
  title: string
  description: string
  youtubeUrl: string      // full YouTube URL or embed URL
  status: StreamStatus
  raceName: string
  venue: string
  scheduledAt: string     // display string e.g. "Today 15:30" or "Mar 19, 2026"
  pinned: boolean
  visible: boolean
}

// ── Extract YouTube video ID from any YT URL ────────
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function getEmbedUrl(url: string, autoplay = false): string {
  const id = extractYoutubeId(url)
  if (!id) return url  // already an embed or unknown format
  return `https://www.youtube.com/embed/${id}?rel=0${autoplay ? '&autoplay=1' : ''}`
}

export function getThumbnailUrl(url: string): string {
  const id = extractYoutubeId(url)
  if (!id) return ''
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
}

// ── Mock data — replace with API call ──────────────
// In production: fetch from GET /api/streams?visible=true
export const mockStreams: Stream[] = [
  {
    id: 1,
    title: 'Ascot Classic — Race #104 LIVE',
    description: 'Live coverage of the Ascot Classic featuring Silver Bullet, Midnight Dash and more.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'live',
    raceName: 'Ascot Classic',
    venue: 'Ascot · Race #104',
    scheduledAt: 'LIVE NOW',
    pinned: true,
    visible: true,
  },
  {
    id: 2,
    title: 'Kentucky Derby Highlights — 2026',
    description: 'Full replay of the Kentucky Derby race including all podium finishers.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'recorded',
    raceName: 'Kentucky Derby',
    venue: 'Churchill Downs',
    scheduledAt: 'Mar 15, 2026',
    pinned: false,
    visible: true,
  },
  {
    id: 3,
    title: 'Mumbai Gold Cup — Preview & Analysis',
    description: 'Expert breakdown of the upcoming Mumbai Gold Cup — horses, odds and predictions.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'upcoming',
    raceName: 'Mumbai Gold Cup',
    venue: 'Mumbai · Race #107',
    scheduledAt: 'Today 17:00',
    pinned: false,
    visible: true,
  },
  {
    id: 4,
    title: 'Royal Cheltenham — Full Race Replay',
    description: 'Watch the complete Royal Cheltenham race from start to finish.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'recorded',
    raceName: 'Royal Cheltenham',
    venue: 'Cheltenham',
    scheduledAt: 'Mar 12, 2026',
    pinned: false,
    visible: true,
  },
  {
    id: 5,
    title: 'Delhi Plate — Upcoming Preview',
    description: 'Pre-race analysis and horse form guide for the Delhi Plate.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'upcoming',
    raceName: 'Delhi Plate',
    venue: 'Delhi · Race #108',
    scheduledAt: 'Today 17:45',
    pinned: false,
    visible: true,
  },
]

type TabFilter = 'all' | 'live' | 'upcoming' | 'recorded'

const STATUS_LABEL: Record<StreamStatus, string> = {
  live:     '● LIVE',
  upcoming: '⏰ Upcoming',
  recorded: '▶ Recorded',
}

export default function RaceStream() {
  // Only show visible streams
  const streams = useMemo(() => mockStreams.filter(s => s.visible), [])

  const [activeTab,    setActiveTab]    = useState<TabFilter>('all')
  const [selectedId,   setSelectedId]   = useState<number>(
    streams.find(s => s.pinned)?.id ?? streams[0]?.id ?? 0
  )

  const filtered = useMemo(() => streams.filter(s => {
    if (activeTab === 'all') return true
    return s.status === activeTab
  }), [streams, activeTab])

  const counts = useMemo(() => ({
    all:      streams.length,
    live:     streams.filter(s => s.status === 'live').length,
    upcoming: streams.filter(s => s.status === 'upcoming').length,
    recorded: streams.filter(s => s.status === 'recorded').length,
  }), [streams])

  const selected = streams.find(s => s.id === selectedId) ?? streams[0]

  return (
    <div className="rs-root">
      
      <p className="rs-page-sub">Live races, upcoming previews and recorded replays</p>

      <div className="row g-3">

        {/* ── Left: featured player ────────────── */}
        <div className="col-12 col-xl-8">
          <div className="rs-featured">

            <div className="rs-embed-wrap">
              {selected ? (
                <>
                  {/* Live / upcoming badge */}
                  {selected.status !== 'recorded' && (
                    <div className={`rs-live-badge ${selected.status === 'upcoming' ? 'upcoming' : ''}`}>
                      {selected.status === 'live' && <span className="rs-live-dot" />}
                      {selected.status === 'live' ? 'LIVE' : 'UPCOMING'}
                    </div>
                  )}
                  <iframe
                    src={getEmbedUrl(selected.youtubeUrl)}
                    title={selected.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </>
              ) : (
                <div className="rs-embed-placeholder">
                  <i className="bi bi-play-circle" />
                  <span>No stream available</span>
                </div>
              )}
            </div>

            {selected && (
              <div className="rs-player-info">
                <div>
                  <div className="rs-player-title">{selected.title}</div>
                  <div className="rs-player-meta">
                    <span><i className="bi bi-geo-alt" />{selected.venue}</span>
                    <span><i className="bi bi-clock" />{selected.scheduledAt}</span>
                    {selected.description && (
                      <span style={{ color: '#c8cdd8' }}>·</span>
                    )}
                    <span style={{ color: '#99a1b7', fontSize: 11 }}>{selected.description}</span>
                  </div>
                </div>
                <a
                  href={selected.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#ff0000', color: '#fff',
                    fontSize: 11, fontWeight: 700, padding: '5px 12px',
                    borderRadius: 6, textDecoration: 'none', flexShrink: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <i className="bi bi-youtube" /> YouTube
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: stream list ───────────────── */}
        <div className="col-12 col-xl-4">
          <div className="rs-panel" style={{ height: '100%' }}>

            <div className="rs-panel-header">
              <span className="rs-panel-title">All Streams</span>
              <div className="rs-tabs">
                {(['all', 'live', 'upcoming', 'recorded'] as TabFilter[]).map(tab => (
                  <button
                    key={tab}
                    className={`rs-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    title={`${counts[tab]} ${tab}`}
                  >
                    {tab === 'all' ? 'All' : tab === 'live' ? '🔴' : tab === 'upcoming' ? '⏰' : '▶'}
                    {tab === 'all' && <span style={{ marginLeft: 4 }}>{counts.all}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: 480 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: '#99a1b7', fontSize: 13 }}>
                  No streams in this category.
                </div>
              ) : filtered.map(stream => (
                <div
                  key={stream.id}
                  className={`rs-card ${selectedId === stream.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(stream.id)}
                >
                  {/* Thumbnail */}
                  <div className="rs-thumb">
                    {getThumbnailUrl(stream.youtubeUrl) ? (
                      <img
                        src={getThumbnailUrl(stream.youtubeUrl)}
                        alt={stream.title}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="rs-thumb-placeholder">
                        <i className="bi bi-play-circle" />
                      </div>
                    )}
                    <span className={`rs-thumb-badge ${stream.status}`}>
                      {stream.status === 'live' ? 'LIVE' : stream.status === 'upcoming' ? 'SOON' : '▶'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="rs-card-info">
                    <div className="rs-card-title">{stream.title}</div>
                    <div className="rs-card-meta">
                      <span>{stream.venue}</span>
                      <span style={{ color: '#e5e7eb' }}>·</span>
                      <span>{stream.scheduledAt}</span>
                    </div>
                    {stream.pinned && (
                      <span style={{ fontSize: 10, color: '#f6b100', fontWeight: 700, marginTop: 2, display: 'inline-block' }}>
                        📌 Pinned
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0 }}>
                    <span className={`rs-thumb-badge ${stream.status}`} style={{ position: 'static', fontSize: 10 }}>
                      {STATUS_LABEL[stream.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}