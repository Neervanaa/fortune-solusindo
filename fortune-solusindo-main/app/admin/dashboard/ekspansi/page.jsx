'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, Row, SaveButton, StatusMessage, Loading, SmallButton } from '@/components/admin/AdminUI';

export default function EkspansiAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=ekspansi').then((r) => r.json()).then((d) => setData(d.error ? { timeline: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setItem = (i, field, v) => setData((d) => { const t = [...d.timeline]; t[i] = { ...t[i], [field]: v }; return { ...d, timeline: t }; });
  const addItem = () => setData((d) => ({ ...d, timeline: [...(d.timeline || []), { date: '', status: '', color: 'var(--amber)', title: '', desc: '' }] }));
  const removeItem = (i) => setData((d) => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=ekspansi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Inovasi &amp; Ekspansi</h1>
      <Card>
        <Field label="Heading"><TextInput value={data.heading || ''} onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))} /></Field>
        <Field label="Subheading"><TextArea rows={2} value={data.subheading || ''} onChange={(e) => setData((d) => ({ ...d, subheading: e.target.value }))} /></Field>
      </Card>

      <Card title="Timeline">
        {(data.timeline || []).map((t, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <Row>
              <Field label="Tanggal"><TextInput value={t.date || ''} onChange={(e) => setItem(i, 'date', e.target.value)} /></Field>
              <Field label="Status"><TextInput value={t.status || ''} onChange={(e) => setItem(i, 'status', e.target.value)} /></Field>
            </Row>
            <Field label="Warna" hint="Contoh: var(--amber) atau rgba(255,255,255,0.75)">
              <TextInput value={t.color || ''} onChange={(e) => setItem(i, 'color', e.target.value)} />
            </Field>
            <Field label="Judul"><TextInput value={t.title || ''} onChange={(e) => setItem(i, 'title', e.target.value)} /></Field>
            <Field label="Deskripsi"><TextArea rows={2} value={t.desc || ''} onChange={(e) => setItem(i, 'desc', e.target.value)} /></Field>
            <SmallButton danger onClick={() => removeItem(i)}>Hapus item ini</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addItem}>+ Tambah item timeline</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
