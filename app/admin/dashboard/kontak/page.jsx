'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, Row, SaveButton, StatusMessage, Loading, SmallButton } from '@/components/admin/AdminUI';

export default function KontakAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=kontak').then((r) => r.json()).then((d) => setData(d.error ? { infoPills: [], channels: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setPill = (i, field, v) => setData((d) => { const p = [...d.infoPills]; p[i] = { ...p[i], [field]: v }; return { ...d, infoPills: p }; });
  const addPill = () => setData((d) => ({ ...d, infoPills: [...(d.infoPills || []), { text: '', type: 'location' }] }));
  const removePill = (i) => setData((d) => ({ ...d, infoPills: d.infoPills.filter((_, idx) => idx !== i) }));

  const setChannel = (i, field, v) => setData((d) => { const c = [...d.channels]; c[i] = { ...c[i], [field]: v }; return { ...d, channels: c }; });
  const addChannel = () => setData((d) => ({ ...d, channels: [...(d.channels || []), { label: '', value: '', href: '', note: '', type: 'whatsapp' }] }));
  const removeChannel = (i) => setData((d) => ({ ...d, channels: d.channels.filter((_, idx) => idx !== i) }));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=kontak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Kontak</h1>
      <Card>
        <Field label="Heading"><TextInput value={data.heading || ''} onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))} /></Field>
        <Field label="Subheading"><TextArea rows={2} value={data.subheading || ''} onChange={(e) => setData((d) => ({ ...d, subheading: e.target.value }))} /></Field>
        <Field label="Nomor WhatsApp" hint="Format internasional tanpa + atau spasi, contoh: 6283833502020">
          <TextInput value={data.whatsapp || ''} onChange={(e) => setData((d) => ({ ...d, whatsapp: e.target.value }))} />
        </Field>
      </Card>

      <Card title="Info Pills (badge singkat di bawah heading)">
        {(data.infoPills || []).map((p, i) => (
          <Row key={i}>
            <Field label="Teks"><TextInput value={p.text || ''} onChange={(e) => setPill(i, 'text', e.target.value)} /></Field>
            <Field label="Tipe ikon" hint="location / hours / response">
              <TextInput value={p.type || ''} onChange={(e) => setPill(i, 'type', e.target.value)} />
            </Field>
            <div style={{ gridColumn: '1 / -1' }}>
              <SmallButton danger onClick={() => removePill(i)}>Hapus pill ini</SmallButton>
            </div>
          </Row>
        ))}
        <SmallButton onClick={addPill}>+ Tambah pill</SmallButton>
      </Card>

      <Card title="Kanal Kontak">
        {(data.channels || []).map((c, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <Row>
              <Field label="Label"><TextInput value={c.label || ''} onChange={(e) => setChannel(i, 'label', e.target.value)} /></Field>
              <Field label="Nilai / Value"><TextInput value={c.value || ''} onChange={(e) => setChannel(i, 'value', e.target.value)} /></Field>
            </Row>
            <Field label="Link (href)"><TextInput value={c.href || ''} onChange={(e) => setChannel(i, 'href', e.target.value)} /></Field>
            <Field label="Catatan"><TextInput value={c.note || ''} onChange={(e) => setChannel(i, 'note', e.target.value)} /></Field>
            <Field label="Tipe ikon" hint="whatsapp / instagram / facebook">
              <TextInput value={c.type || ''} onChange={(e) => setChannel(i, 'type', e.target.value)} />
            </Field>
            <SmallButton danger onClick={() => removeChannel(i)}>Hapus kanal ini</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addChannel}>+ Tambah kanal</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
