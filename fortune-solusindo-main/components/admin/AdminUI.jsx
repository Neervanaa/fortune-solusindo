'use client';

import { useState } from 'react';

export function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      {title && <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: '#1e2a6e' }}>{title}</h2>}
      {children}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: '#333' }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>{hint}</div>}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '0.55rem 0.7rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.88rem', fontFamily: 'inherit' };

export function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

export function TextArea(props) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', ...(props.style || {}) }} />;
}

export function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>;
}

export function SaveButton({ onClick, saving, label = 'Simpan Perubahan' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      style={{ background: '#1e2a6e', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: 4, fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
    >
      {saving ? 'Menyimpan...' : label}
    </button>
  );
}

export function SmallButton({ onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: danger ? '#fdeaea' : '#eef0fa',
        color: danger ? '#c0392b' : '#1e2a6e',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: 4,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function StatusMessage({ status }) {
  if (!status) return null;
  const isError = status.type === 'error';
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.6rem 0.9rem',
        borderRadius: 4,
        fontSize: '0.85rem',
        background: isError ? '#fdeaea' : '#e8f7ee',
        color: isError ? '#c0392b' : '#1e7e42',
      }}
    >
      {status.message}
    </div>
  );
}

export function Loading() {
  return <p style={{ color: '#888', fontSize: '0.9rem' }}>Memuat data...</p>;
}

/** Uploads an image file to /api/upload and returns the stored path/URL, or null on failure. */
export function ImageUploadField({ label, currentPath, onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        onUploaded(data.path);
      } else {
        setError(data.error || 'Gagal upload');
      }
    } catch {
      setError('Gagal upload (jaringan)');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label}>
      <div
        style={{ border: '1px dashed #ccc', borderRadius: 4, padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
        onClick={() => document.getElementById(`upload-${label}`)?.click()}
      >
        <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Klik untuk upload gambar baru</p>
        <p style={{ fontSize: '0.72rem', color: '#999', margin: 0 }}>JPG / PNG / WebP — maks 5MB</p>
      </div>
      <input id={`upload-${label}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
      {(preview || currentPath) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview || currentPath} alt="" style={{ maxWidth: '100%', maxHeight: 180, marginTop: '0.6rem', borderRadius: 4 }} />
      )}
      {uploading && <p style={{ fontSize: '0.75rem', color: '#888' }}>Mengunggah...</p>}
      {error && <p style={{ fontSize: '0.75rem', color: '#c0392b' }}>{error}</p>}
      {currentPath && !preview && <p style={{ fontSize: '0.72rem', color: '#999', marginTop: '0.25rem' }}>Gambar saat ini: {currentPath}</p>}
    </Field>
  );
}
