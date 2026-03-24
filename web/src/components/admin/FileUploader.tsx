// src/components/admin/FileUploader.tsx
import { useState } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../../constants/api'

export default function FileUploader() {
  const [races, setRaces] = useState([])
  const [file,  setFile]  = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleParse = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/api/races/parse-html', formData)
    setRaces(res.data)
  }

  const handleImport = async () => {
    await axios.post(API_ENDPOINTS.IMPORT_RACES, races)
    alert('Races imported successfully!')
  }

  return (
    <div className="p-3">
      <h5 className="mb-3">Race Card File Uploader</h5>

      <div className="d-flex align-items-center gap-3 flex-wrap">
        <input
          type="file"
          accept=".html"
          className="form-control"
          style={{ maxWidth: 300 }}
          onChange={handleFileChange}
        />
        <button className="btn btn-primary btn-sm" onClick={handleParse} disabled={!file}>
          <i className="bi bi-file-earmark-code me-1" />Parse File
        </button>
        <button className="btn btn-success btn-sm" onClick={handleImport} disabled={races.length === 0}>
          <i className="bi bi-database-add me-1" />Import to DB
        </button>
      </div>

      {races.length > 0 && (
        <div className="mt-3 alert alert-info">
          {races.length} races parsed and ready to import.
        </div>
      )}
    </div>
  )
}
