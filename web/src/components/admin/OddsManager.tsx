// src/components/admin/OddsManager.tsx
import { useState } from 'react'
import '../../styles/OddsManager.css'
import RaceList from '../shared/RaceList'
import { RaceDatePicker } from '../custom/RaceDatePicker'

const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const cities = ['Mumbai', 'Pune', 'Bangalore', 'Mysore', 'Hyderabad', 'Kolkata', 'Chennai', 'Delhi']

export default function OddsManager() {
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="arm-root">

      {/* Top bar: date picker + active city label */}
      <div className="arm-topbar">
        <div>
          <h5 className="arm-page-title">Odds Manager</h5>
          <p className="arm-page-sub">
            {selectedCity} · {formatDate(selectedDate)}
          </p>
        </div>
        <RaceDatePicker value={selectedDate} onChange={date => setSelectedDate(date)} />
      </div>

      {/* City tab strip */}
      <div className="arm-city-strip">
        {cities.map(city => (
          <button
            key={city}
            className={`arm-city-tab ${selectedCity === city ? 'active' : ''}`}
            onClick={() => setSelectedCity(city)}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Race accordion list */}
      <RaceList city={selectedCity} date={formatDate(selectedDate)} />

    </div>
  )
}