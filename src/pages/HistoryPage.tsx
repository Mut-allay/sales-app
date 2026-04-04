import { FC, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { HistoryEntry, DocumentType } from '../data/types'
import { format } from 'date-fns/format'
import Nav from '../components/Nav'
import InvoicePage from '../components/InvoicePage'

function getHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem('history')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const HistoryPage: FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory)
  const [filter, setFilter] = useState<DocumentType | 'all'>('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const filtered =
    filter === 'all' ? history : history.filter((e) => e.documentType === filter)

  function handleClear() {
    setHistory([])
    window.localStorage.setItem('history', JSON.stringify([]))
    setConfirmClear(false)
  }

  return (
    <div>
      <Nav />
      <div className="history-page">
        <div className="history-page__header">
          <h1>Document History</h1>
          {history.length > 0 && (
            <div>
              {confirmClear ? (
                <>
                  <span className="history-page__confirm-text">Clear all history?</span>
                  <button className="history-page__clear-btn" onClick={handleClear}>
                    Yes, clear
                  </button>
                  <button
                    className="history-page__cancel-btn"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="history-page__clear-btn"
                  onClick={() => setConfirmClear(true)}
                >
                  Clear History
                </button>
              )}
            </div>
          )}
        </div>

        <div className="history-page__filters">
          {(['all', 'invoice', 'quotation', 'receipt'] as const).map((f) => (
            <button
              key={f}
              className={`history-page__filter-btn${filter === f ? ' history-page__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="history-page__empty">
            No {filter === 'all' ? 'documents' : filter + 's'} in history yet.
          </p>
        ) : (
          <div className="history-page__list">
            {filtered.map((entry) => (
              <div key={entry.id} className="history-page__card">
                <div className="history-page__card-header">
                  <span
                    className={`history-page__badge history-page__badge--${entry.documentType}`}
                  >
                    {entry.documentType}
                  </span>
                  <span className="history-page__title">
                    {entry.title || 'Untitled'}
                  </span>
                </div>
                <div className="history-page__card-details">
                  {entry.clientName && (
                    <span className="history-page__client">{entry.clientName}</span>
                  )}
                  <span className="history-page__date">
                    {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className="history-page__card-actions">
                  <PDFDownloadLink
                    document={<InvoicePage pdfMode={true} data={entry.data} />}
                    fileName={`${entry.documentType}-${entry.title || 'document'}.pdf`}
                    className="history-page__download-btn"
                  >
                    {({ loading }) => (loading ? 'Preparing...' : 'Re-download PDF')}
                  </PDFDownloadLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
