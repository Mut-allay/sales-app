import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import InvoicePage from './components/InvoicePage'
import Nav from './components/Nav'
import ContactsPage from './pages/ContactsPage'
import HistoryPage from './pages/HistoryPage'
import { Invoice, HistoryEntry, DocumentType } from './data/types'
import { initialInvoice, initialQuotation, initialReceipt } from './data/initialData'

function loadDoc(key: string, fallback: Invoice): Invoice {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveHistory(entry: HistoryEntry) {
  try {
    const raw = window.localStorage.getItem('history')
    const existing: HistoryEntry[] = raw ? JSON.parse(raw) : []
    window.localStorage.setItem('history', JSON.stringify([entry, ...existing]))
  } catch {}
}

function makeHistoryHandler(documentType: DocumentType) {
  return (data: Invoice) => {
    saveHistory({
      id: crypto.randomUUID(),
      documentType,
      title: data.invoiceTitle || 'Untitled',
      clientName: data.clientName || '',
      date: new Date().toISOString(),
      data,
    })
  }
}

function DocumentRoute({
  storageKey,
  fallback,
  documentType,
}: {
  storageKey: string
  fallback: Invoice
  documentType: DocumentType
}) {
  const [data, setData] = useState<Invoice>(() => loadDoc(storageKey, fallback))

  function handleChange(invoice: Invoice) {
    setData(invoice)
    window.localStorage.setItem(storageKey, JSON.stringify(invoice))
  }

  return (
    <div>
      <Nav />
      <div className="app">
        <InvoicePage
          data={data}
          onChange={handleChange}
          documentType={documentType}
          onSaveToHistory={makeHistoryHandler(documentType)}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DocumentRoute
              storageKey="invoiceData"
              fallback={initialInvoice}
              documentType="invoice"
            />
          }
        />
        <Route
          path="/quotation"
          element={
            <DocumentRoute
              storageKey="quotationData"
              fallback={initialQuotation}
              documentType="quotation"
            />
          }
        />
        <Route
          path="/receipt"
          element={
            <DocumentRoute
              storageKey="receiptData"
              fallback={initialReceipt}
              documentType="receipt"
            />
          }
        />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
