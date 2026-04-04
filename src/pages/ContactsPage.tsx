import { FC, useState } from 'react'
import { Contact, ContactType } from '../data/types'
import Nav from '../components/Nav'

function getContacts(): Contact[] {
  try {
    const raw = window.localStorage.getItem('contacts')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveContacts(contacts: Contact[]) {
  window.localStorage.setItem('contacts', JSON.stringify(contacts))
}

const emptyForm = (): Omit<Contact, 'id' | 'createdAt'> => ({
  type: 'contact',
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
})

const ContactsPage: FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(getContacts)
  const [filter, setFilter] = useState<ContactType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = filter === 'all' ? contacts : contacts.filter((c) => c.type === filter)

  function handleFormChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return

    let updated: Contact[]
    if (editingId) {
      updated = contacts.map((c) =>
        c.id === editingId ? { ...c, ...form } : c
      )
    } else {
      const newContact: Contact = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      updated = [newContact, ...contacts]
    }

    setContacts(updated)
    saveContacts(updated)
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(false)
  }

  function handleEdit(contact: Contact) {
    setForm({
      type: contact.type,
      name: contact.name,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      notes: contact.notes,
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  function handleDelete(id: string) {
    const updated = contacts.filter((c) => c.id !== id)
    setContacts(updated)
    saveContacts(updated)
    setConfirmDeleteId(null)
  }

  function handleCancel() {
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div>
      <Nav />
      <div className="contacts-page">
        <div className="contacts-page__header">
          <h1>Contacts &amp; Leads</h1>
          {!showForm && (
            <button className="contacts-page__add-btn" onClick={() => setShowForm(true)}>
              + Add Contact
            </button>
          )}
        </div>

        {showForm && (
          <div className="contacts-page__form">
            <h2>{editingId ? 'Edit Contact' : 'New Contact'}</h2>
            <div className="contacts-page__form-grid">
              <label>
                Name *
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => handleFormChange('company', e.target.value)}
                  placeholder="Company name"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="+1 000 000 0000"
                />
              </label>
              <label>
                Address
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </label>
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <option value="contact">Contact</option>
                  <option value="lead">Lead</option>
                </select>
              </label>
              <label className="contacts-page__form-full">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Additional notes"
                  rows={3}
                />
              </label>
            </div>
            <div className="contacts-page__form-actions">
              <button className="contacts-page__save-btn" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Add Contact'}
              </button>
              <button className="contacts-page__cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="contacts-page__filters">
          {(['all', 'contact', 'lead'] as const).map((f) => (
            <button
              key={f}
              className={`contacts-page__filter-btn${filter === f ? ' contacts-page__filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'contact' ? 'Contacts' : 'Leads'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="contacts-page__empty">No {filter === 'all' ? '' : filter + 's'} found.</p>
        ) : (
          <div className="contacts-page__list">
            {filtered.map((contact) => (
              <div key={contact.id} className="contacts-page__card">
                <div className="contacts-page__card-header">
                  <div>
                    <span className="contacts-page__name">{contact.name}</span>
                    {contact.company && (
                      <span className="contacts-page__company"> · {contact.company}</span>
                    )}
                  </div>
                  <span className={`contacts-page__badge contacts-page__badge--${contact.type}`}>
                    {contact.type}
                  </span>
                </div>
                <div className="contacts-page__card-details">
                  {contact.email && <span>{contact.email}</span>}
                  {contact.phone && <span>{contact.phone}</span>}
                  {contact.address && <span>{contact.address}</span>}
                  {contact.notes && <span className="contacts-page__notes">{contact.notes}</span>}
                </div>
                <div className="contacts-page__card-actions">
                  <button className="contacts-page__edit-btn" onClick={() => handleEdit(contact)}>
                    Edit
                  </button>
                  {confirmDeleteId === contact.id ? (
                    <>
                      <span className="contacts-page__confirm-text">Delete?</span>
                      <button
                        className="contacts-page__delete-btn"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Yes
                      </button>
                      <button
                        className="contacts-page__cancel-btn"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      className="contacts-page__delete-btn"
                      onClick={() => setConfirmDeleteId(contact.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactsPage
