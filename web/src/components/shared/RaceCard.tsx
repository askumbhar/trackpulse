// src/components/shared/RaceCard.tsx
import { useState } from 'react'
import '../../styles/OddsManager.css'   // arm-table, odds-input, update-btn styles live here

interface Horse {
  id: string
  name: string
  winOdds: number
  placeOdds: number
}

interface Props {
  raceId?: number   // passed from RaceList; can be used for API call later
}

const initialHorses: Horse[] = [
  { id: '#01', name: 'Silver Bullet',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#02', name: 'Midnight Dash',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#03', name: 'Midnight Dash',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#04', name: 'Silver Bullet',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#05', name: 'Silver Foroxa',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#06', name: 'Silver Granvt',  winOdds: 3.5, placeOdds: 1.2 },
  { id: '#07', name: 'Midnight Dash',  winOdds: 3.0, placeOdds: 1.1 },
  { id: '#08', name: 'Silver Bullet',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#09', name: 'Silver Kinest',  winOdds: 3.0, placeOdds: 1.1 },
  { id: '#10', name: 'Midnight Dash',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#11', name: 'Driver Lineve',  winOdds: 4.5, placeOdds: 1.5 },
  { id: '#12', name: 'Roscor Dash',    winOdds: 4.5, placeOdds: 1.5 },
  { id: '#13', name: 'Silver Bullet',  winOdds: 4.5, placeOdds: 1.5 },
]

export default function RaceCard({ raceId }: Props) {
  const [horses, setHorses] = useState<Horse[]>(initialHorses)
  const [saved,  setSaved]  = useState<Record<string, boolean>>({})

  const handleOddsChange = (id: string, field: 'winOdds' | 'placeOdds', value: string) => {
    setHorses(prev => prev.map(h => h.id === id ? { ...h, [field]: Number(value) } : h))
  }

  const handleUpdate = (id: string) => {
    // TODO: call PUT /api/race/odds with updated horse odds
    setSaved(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [id]: false })), 1500)
  }

  return (
    <div className="arm-panel-body">
      <table className="arm-table">
        <thead>
          <tr>
            <th>Horse #</th>
            <th>Name</th>
            <th>Win Odds</th>
            <th>Place Odds</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {horses.map(horse => (
            <tr key={horse.id}>
              <td><span className="horse-id">{horse.id}</span></td>
              <td>{horse.name}</td>
              <td>
                <input
                  type="number"
                  className="odds-input"
                  value={horse.winOdds}
                  step={0.5}
                  min={1}
                  onChange={e => handleOddsChange(horse.id, 'winOdds', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="odds-input"
                  value={horse.placeOdds}
                  step={0.1}
                  min={1}
                  onChange={e => handleOddsChange(horse.id, 'placeOdds', e.target.value)}
                />
              </td>
              <td>
                <button
                  className={`update-btn ${saved[horse.id] ? 'saved' : ''}`}
                  onClick={() => handleUpdate(horse.id)}
                >
                  {saved[horse.id] ? '✓ Saved' : 'Update'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
