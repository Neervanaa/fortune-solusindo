'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, Row, SaveButton, StatusMessage, Loading, ImageUploadField } from '@/components/admin/AdminUI';

export default function HeroAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=hero')
      .then((r) => r.json())
      .then((d) => setData(d.error ? { stats: [] } : d));
  }, []);

  if (!data) return <Loading />;

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }));
  }
  function updateCta(key, field, value) {
    setData((d) => ({ ...d, [key]: { ...(d[key] || {}), [field]: value } }));
  }
  function updateStat(i, field, value) {
    setData((d) => {
      const stats = [...(d.stats || [])];
      stats[i] = { ...stats[i], [field]: value };
      return { ...d, stats };
    });
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Hero / Banner Utama</h1>
      <Card>
        <Field label="Teks Kecil (Eyebrow)">
          <TextInput value={data.eyebrow || ''} onChange={(e) => update('eyebrow', e.target.value)} />
        </Field>
        <Field label="Heading Utama" hint="Gunakan baris baru untuk line-break">
          <TextArea rows={2} value={data.heading || ''} onChange={(e) => update('heading', e.target.value)} />
        </Field>
        <Field label="Paragraf Deskripsi">
          <TextArea rows={3} value={data.subheading || ''} onChange={(e) => update('subheading', e.target.value)} />
        </Field>
        <Row>
          <Field label="Label Tombol Utama (CTA)">
            <TextInput value={data.ctaPrimary?.label || ''} onChange={(e) => updateCta('ctaPrimary', 'label', e.target.value)} />
          </Field>
          <Field label="Link Tombol Utama">
            <TextInput value={data.ctaPrimary?.href || ''} onChange={(e) => updateCta('ctaPrimary', 'href', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Label Tombol Kedua">
            <TextInput value={data.ctaSecondary?.label || ''} onChange={(e) => updateCta('ctaSecondary', 'label', e.target.value)} />
          </Field>
          <Field label="Link Tombol Kedua">
            <TextInput value={data.ctaSecondary?.href || ''} onChange={(e) => updateCta('ctaSecondary', 'href', e.target.value)} />
          </Field>
        </Row>
      </Card>

      <Card title="Statistik (3 item)">
        {(data.stats || []).map((s, i) => (
          <Row key={i}>
            <Field label={`Label Stat ${i + 1}`}>
              <TextInput value={s.label || ''} onChange={(e) => updateStat(i, 'label', e.target.value)} />
            </Field>
            <Field label={`Nilai Stat ${i + 1}`}>
              <TextInput value={s.value || ''} onChange={(e) => updateStat(i, 'value', e.target.value)} />
            </Field>
          </Row>
        ))}
      </Card>

      <Card title="Foto Hero">
        <ImageUploadField label="Foto Hero (gambar kartu kanan)" currentPath={data.heroImage} onUploaded={(path) => update('heroImage', path)} />
        <Field label="Caption Foto Hero">
          <TextInput value={data.heroImageCaption || ''} onChange={(e) => update('heroImageCaption', e.target.value)} />
        </Field>
        <Field label="Alt Text Foto Hero">
          <TextInput value={data.heroImageAlt || ''} onChange={(e) => update('heroImageAlt', e.target.value)} />
        </Field>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
