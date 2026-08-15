'use client'

import React, { useState, useEffect } from 'react'
import Modal from './Modal'

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (note: string) => void
  title: string
  subtitle?: string
  label?: string
  placeholder?: string
  initialValue?: string
  submitText?: string
  isLoading?: boolean
  isRequired?: boolean
}

export default function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  label = 'Note',
  placeholder = 'Add any additional context or comments...',
  initialValue = '',
  submitText = 'Save',
  isLoading = false,
  isRequired = false,
}: NoteModalProps) {
  const [note, setNote] = useState(initialValue)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setNote(initialValue)
      setError('')
    }
  }, [isOpen, initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isRequired && !note.trim()) {
      setError('This field is required.')
      return
    }
    onSubmit(note.trim())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} maxWidth="480px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          {label && (
            <label
              className="text-label"
              style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}
            >
              {label} {isRequired && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
          )}
          <textarea
            className="input"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            placeholder={placeholder}
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              if (error) setError('')
            }}
            disabled={isLoading}
            autoFocus
          />
          {error && <p className="field-error" style={{ marginTop: '4px' }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-solid"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : submitText}
          </button>
        </div>
      </form>
    </Modal>
  )
}
