'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, SaveButton, StatusMessage, Loading, SmallButton } from '@/components/admin/AdminUI';

export default function AboutAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=about').then((r) => r.json()).then((d) => setData(d.error ? { paragraphs: [], tags: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setParagraph = (i, v) => setData((d) => { const p = [...d.paragraphs]; p[i] = v; return { ...d, paragraphs: p }; });
  const addParagraph = () => setData((d) => ({ ...d, paragraphs: [...(d.paragraphs || []), ''] }));
  const removeParagraph = (i) => setData((d) => ({ ...d, paragraphs: d.paragraphs.filter((_, idx) => idx !== i) }));

  const setTag = (i, v) => setData((d) => { const t = [...d.tags]; t[i] = v; return { ...d, tags: t }; });
  const addTag = () => setData((d) => ({ ...d, tags: [...(d.tags || []), ''] }));
  const removeTag = (i) => setData((d) => ({ ...d, tags: d.tags.filter((_, idx) => idx !== i) }));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Tentang Kami</h1>
      <Card>
        <Field label="Heading">
          <TextInput value={data.heading || ''} onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))} />
        </Field>
      </Card>

      <Card title="Paragraf">
        {(data.paragraphs || []).map((p, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <TextArea rows={3} value={p} onChange={(e) => setParagraph(i, e.target.value)} />
            <div style={{ marginTop: '0.35rem' }}>
              <SmallButton danger onClick={() => removeParagraph(i)}>Hapus paragraf {i + 1}</SmallButton>
            </div>
          </div>
        ))}
        <SmallButton onClick={addParagraph}>+ Tambah paragraf</SmallButton>
      </Card>

      <Card title="Tag / Label">
        {(data.tags || []).map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TextInput value={t} onChange={(e) => setTag(i, e.target.value)} />
            <SmallButton danger onClick={() => removeTag(i)}>Hapus</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addTag}>+ Tambah tag</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
