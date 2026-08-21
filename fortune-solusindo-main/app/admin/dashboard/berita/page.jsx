'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, Row, SaveButton, StatusMessage, Loading, SmallButton, ImageUploadField } from '@/components/admin/AdminUI';

function emptyArticle() {
  return { slug: '', title: '', date: '', month: '', category: '', excerpt: '', coverImage: '', body: [] };
}

function emptySection() {
  return { id: '', heading: '', content: '', image: '' };
}

export default function BeritaAdminPage() {
  const [articles, setArticles] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); // null = list view
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=berita').then((r) => r.json()).then((d) => setArticles(Array.isArray(d) ? d : []));
  }, []);

  if (!articles) return <Loading />;

  async function loadFullArticle(slug) {
    const res = await fetch(`/api/content?section=berita&slug=${encodeURIComponent(slug)}`);
    return res.json();
  }

  async function openEdit(i) {
    const art = articles[i];
    if (art.slug && (!art.body || art.body === undefined)) {
      const full = await loadFullArticle(art.slug);
      const updated = [...articles];
      updated[i] = full;
      setArticles(updated);
    }
    setEditingIndex(i);
  }

  function addNewArticle() {
    setArticles((a) => [emptyArticle(), ...a]);
    setEditingIndex(0);
  }

  function updateArticleField(i, field, value) {
    setArticles((a) => { const copy = [...a]; copy[i] = { ...copy[i], [field]: value }; return copy; });
  }

  function updateSection(i, si, field, value) {
    setArticles((a) => {
      const copy = [...a];
      const body = [...(copy[i].body || [])];
      body[si] = { ...body[si], [field]: value };
      copy[i] = { ...copy[i], body };
      return copy;
    });
  }
  function addSection(i) {
    setArticles((a) => { const copy = [...a]; copy[i] = { ...copy[i], body: [...(copy[i].body || []), emptySection()] }; return copy; });
  }
  function removeSection(i, si) {
    setArticles((a) => { const copy = [...a]; copy[i] = { ...copy[i], body: copy[i].body.filter((_, idx) => idx !== si) }; return copy; });
  }

  async function deleteArticle(i) {
    if (!confirm('Hapus artikel ini? Aksi ini akan langsung disimpan ke database.')) return;
    const remaining = articles.filter((_, idx) => idx !== i);
    setSaving(true);
    const res = await fetch('/api/content?section=berita', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(remaining),
    });
    const result = await res.json();
    setSaving(false);
    if (result.success) {
      setArticles(remaining);
      setEditingIndex(null);
      setStatus({ type: 'ok', message: 'Artikel dihapus.' });
    } else {
      setStatus({ type: 'error', message: result.error || 'Gagal menghapus.' });
    }
  }

  async function saveAll() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=berita', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(articles),
    });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Semua perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
    if (result.success) setEditingIndex(null);
  }

  if (editingIndex !== null) {
    const art = articles[editingIndex];
    return (
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Artikel</h1>
        <Card>
          <Field label="Slug (URL)" hint="huruf kecil, angka, dan tanda hubung saja, contoh: tips-memilih-mesin">
            <TextInput value={art.slug || ''} onChange={(e) => updateArticleField(editingIndex, 'slug', e.target.value)} />
          </Field>
          <Field label="Judul"><TextInput value={art.title || ''} onChange={(e) => updateArticleField(editingIndex, 'title', e.target.value)} /></Field>
          <Row>
            <Field label="Tanggal (tampil)" hint="contoh: 2 Juli 2026">
              <TextInput value={art.date || ''} onChange={(e) => updateArticleField(editingIndex, 'date', e.target.value)} />
            </Field>
            <Field label="Bulan (untuk arsip)" hint="format YYYY-MM, contoh: 2026-07">
              <TextInput value={art.month || ''} onChange={(e) => updateArticleField(editingIndex, 'month', e.target.value)} />
            </Field>
          </Row>
          <Field label="Kategori" hint="contoh: Panduan / Bisnis / Teknis">
            <TextInput value={art.category || ''} onChange={(e) => updateArticleField(editingIndex, 'category', e.target.value)} />
          </Field>
          <Field label="Excerpt / Ringkasan"><TextArea rows={2} value={art.excerpt || ''} onChange={(e) => updateArticleField(editingIndex, 'excerpt', e.target.value)} /></Field>
          <ImageUploadField label="Cover Image" currentPath={art.coverImage} onUploaded={(path) => updateArticleField(editingIndex, 'coverImage', path)} />
        </Card>

        <Card title="Isi Artikel (Body Sections)">
          {(art.body || []).map((sec, si) => (
            <div key={si} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
              <Field label="ID Section" hint="slug pendek untuk anchor link, contoh: kebutuhan-volume">
                <TextInput value={sec.id || ''} onChange={(e) => updateSection(editingIndex, si, 'id', e.target.value)} />
              </Field>
              <Field label="Heading"><TextInput value={sec.heading || ''} onChange={(e) => updateSection(editingIndex, si, 'heading', e.target.value)} /></Field>
              <Field label="Konten"><TextArea rows={4} value={sec.content || ''} onChange={(e) => updateSection(editingIndex, si, 'content', e.target.value)} /></Field>
              <ImageUploadField label={`Gambar section ${si + 1} (opsional)`} currentPath={sec.image} onUploaded={(path) => updateSection(editingIndex, si, 'image', path)} />
              <SmallButton danger onClick={() => removeSection(editingIndex, si)}>Hapus section ini</SmallButton>
            </div>
          ))}
          <SmallButton onClick={() => addSection(editingIndex)}>+ Tambah section</SmallButton>
        </Card>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <SaveButton onClick={saveAll} saving={saving} label="Simpan Semua Perubahan" />
          <SmallButton onClick={() => setEditingIndex(null)}>Kembali ke daftar</SmallButton>
        </div>
        <StatusMessage status={status} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Kelola Berita</h1>
        <SmallButton onClick={addNewArticle}>+ Tulis artikel baru</SmallButton>
      </div>

      <Card>
        {articles.length === 0 ? (
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Belum ada artikel.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '0.5rem' }}>Judul</th>
                <th style={{ padding: '0.5rem' }}>Kategori</th>
                <th style={{ padding: '0.5rem' }}>Tanggal</th>
                <th style={{ padding: '0.5rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a.slug || i} style={{ borderBottom: '1px solid #f2f2f2' }}>
                  <td style={{ padding: '0.5rem' }}>{a.title}</td>
                  <td style={{ padding: '0.5rem' }}>{a.category}</td>
                  <td style={{ padding: '0.5rem' }}>{a.date}</td>
                  <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <SmallButton onClick={() => openEdit(i)}>Edit</SmallButton>
                    <SmallButton danger onClick={() => deleteArticle(i)}>Hapus</SmallButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <StatusMessage status={status} />
    </div>
  );
}
