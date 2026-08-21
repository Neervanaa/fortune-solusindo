'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, SaveButton, StatusMessage, Loading, SmallButton, ImageUploadField } from '@/components/admin/AdminUI';

export default function LayananAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=layanan').then((r) => r.json()).then((d) => setData(d.error ? { pillars: [], gallery: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setPillar = (i, field, v) => setData((d) => { const p = [...d.pillars]; p[i] = { ...p[i], [field]: v }; return { ...d, pillars: p }; });
  const addPillar = () => setData((d) => ({ ...d, pillars: [...(d.pillars || []), { tag: '', title: '', desc: '', brands: [] }] }));
  const removePillar = (i) => setData((d) => ({ ...d, pillars: d.pillars.filter((_, idx) => idx !== i) }));
  const setBrand = (pi, bi, v) => setData((d) => { const p = [...d.pillars]; const brands = [...(p[pi].brands || [])]; brands[bi] = v; p[pi] = { ...p[pi], brands }; return { ...d, pillars: p }; });
  const addBrand = (pi) => setData((d) => { const p = [...d.pillars]; p[pi] = { ...p[pi], brands: [...(p[pi].brands || []), ''] }; return { ...d, pillars: p }; });
  const removeBrand = (pi, bi) => setData((d) => { const p = [...d.pillars]; p[pi] = { ...p[pi], brands: p[pi].brands.filter((_, idx) => idx !== bi) }; return { ...d, pillars: p }; });

  const setGallery = (i, field, v) => setData((d) => { const g = [...d.gallery]; g[i] = { ...g[i], [field]: v }; return { ...d, gallery: g }; });
  const addGallery = () => setData((d) => ({ ...d, gallery: [...(d.gallery || []), { src: '', caption: '' }] }));
  const removeGallery = (i) => setData((d) => ({ ...d, gallery: d.gallery.filter((_, idx) => idx !== i) }));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=layanan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Layanan &amp; Bisnis Utama</h1>
      <Card>
        <Field label="Heading">
          <TextInput value={data.heading || ''} onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))} />
        </Field>
        <Field label="Subheading">
          <TextArea rows={2} value={data.subheading || ''} onChange={(e) => setData((d) => ({ ...d, subheading: e.target.value }))} />
        </Field>
      </Card>

      <Card title="Pilar Layanan">
        {(data.pillars || []).map((p, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <Field label="Tag"><TextInput value={p.tag || ''} onChange={(e) => setPillar(i, 'tag', e.target.value)} /></Field>
            <Field label="Judul"><TextInput value={p.title || ''} onChange={(e) => setPillar(i, 'title', e.target.value)} /></Field>
            <Field label="Deskripsi"><TextArea rows={2} value={p.desc || ''} onChange={(e) => setPillar(i, 'desc', e.target.value)} /></Field>
            <Field label="Brand / Merek">
              {(p.brands || []).map((b, bi) => (
                <div key={bi} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <TextInput value={b} onChange={(e) => setBrand(i, bi, e.target.value)} />
                  <SmallButton danger onClick={() => removeBrand(i, bi)}>Hapus</SmallButton>
                </div>
              ))}
              <SmallButton onClick={() => addBrand(i)}>+ Tambah brand</SmallButton>
            </Field>
            <SmallButton danger onClick={() => removePillar(i)}>Hapus pilar ini</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addPillar}>+ Tambah pilar</SmallButton>
      </Card>

      <Card title="Galeri Mesin & Instalasi">
        {(data.gallery || []).map((g, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <ImageUploadField label={`Gambar galeri ${i + 1}`} currentPath={g.src} onUploaded={(path) => setGallery(i, 'src', path)} />
            <Field label="Caption"><TextInput value={g.caption || ''} onChange={(e) => setGallery(i, 'caption', e.target.value)} /></Field>
            <SmallButton danger onClick={() => removeGallery(i)}>Hapus item galeri ini</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addGallery}>+ Tambah item galeri</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
