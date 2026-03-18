// src/components/shared/RaceList.tsx
import { useEffect, useState } from 'react'
import RaceCard from './RaceCard'

interface Race {
  race_id: number
  race_number: number
  race_name: string
}

interface Props {
  city: string
  date: string
}

export default function RaceList({ city, date }: Props) {
  const [races,   setRaces]   = useState<Race[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!city || !date) return
    setLoading(true)
    setError('')

    fetch(`https://localhost:7156/api/race/races?cityName=${city}&raceDate=${date}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        return res.json()
      })
      .then(data => setRaces(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [city, date])

  if (loading) return (
    <div className="text-center py-4">
      <div className="spinner-border spinner-border-sm text-primary me-2" />
      Loading races...
    </div>
  )

  if (error) return (
    <div className="alert alert-danger py-2" style={{ fontSize: 13 }}>
      <i className="bi bi-exclamation-triangle me-2" />{error}
    </div>
  )

  if (races.length === 0) return (
    <div className="text-muted" style={{ fontSize: 13, padding: '12px 0' }}>
      No races available for {city} on {date}.
    </div>
  )

  return (
    <div className="accordion" id="raceAccordion">
      {races.map(race => (
        <div className="accordion-item mb-2" key={race.race_id}>
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#race${race.race_id}`}
            >
              Race {race.race_number} — {race.race_name}
            </button>
          </h2>
          <div
            id={`race${race.race_id}`}
            className="accordion-collapse collapse"
            data-bs-parent="#raceAccordion"
          >
            <div className="accordion-body p-0">
              <RaceCard raceId={race.race_id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
