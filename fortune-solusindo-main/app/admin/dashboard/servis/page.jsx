'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextInput, TextArea, SaveButton, StatusMessage, Loading, SmallButton } from '@/components/admin/AdminUI';

export default function ServisAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=servis').then((r) => r.json()).then((d) => setData(d.error ? { regions: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setRegion = (i, field, v) => setData((d) => { const r = [...d.regions]; r[i] = { ...r[i], [field]: v }; return { ...d, regions: r }; });
  const addRegion = () => setData((d) => ({ ...d, regions: [...(d.regions || []), { tag: '', color: 'var(--signal-green)', perks: [] }] }));
  const removeRegion = (i) => setData((d) => ({ ...d, regions: d.regions.filter((_, idx) => idx !== i) }));
  const setPerk = (ri, pi, v) => setData((d) => { const r = [...d.regions]; const perks = [...(r[ri].perks || [])]; perks[pi] = v; r[ri] = { ...r[ri], perks }; return { ...d, regions: r }; });
  const addPerk = (ri) => setData((d) => { const r = [...d.regions]; r[ri] = { ...r[ri], perks: [...(r[ri].perks || []), ''] }; return { ...d, regions: r }; });
  const removePerk = (ri, pi) => setData((d) => { const r = [...d.regions]; r[ri] = { ...r[ri], perks: r[ri].perks.filter((_, idx) => idx !== pi) }; return { ...d, regions: r }; });

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=servis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Program Servis</h1>
      <Card>
        <Field label="Heading"><TextInput value={data.heading || ''} onChange={(e) => setData((d) => ({ ...d, heading: e.target.value }))} /></Field>
        <Field label="Deskripsi"><TextArea rows={3} value={data.description || ''} onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))} /></Field>
      </Card>

      <Card title="Region / Wilayah Servis">
        {(data.regions || []).map((r, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
            <Field label="Tag Wilayah"><TextInput value={r.tag || ''} onChange={(e) => setRegion(i, 'tag', e.target.value)} /></Field>
            <Field label="Warna (CSS var atau hex)" hint="Contoh: var(--signal-green) atau #22c55e">
              <TextInput value={r.color || ''} onChange={(e) => setRegion(i, 'color', e.target.value)} />
            </Field>
            <Field label="Keuntungan / Perks">
              {(r.perks || []).map((p, pi) => (
                <div key={pi} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <TextInput value={p} onChange={(e) => setPerk(i, pi, e.target.value)} />
                  <SmallButton danger onClick={() => removePerk(i, pi)}>Hapus</SmallButton>
                </div>
              ))}
              <SmallButton onClick={() => addPerk(i)}>+ Tambah perk</SmallButton>
            </Field>
            <SmallButton danger onClick={() => removeRegion(i)}>Hapus region ini</SmallButton>
          </div>
        ))}
        <SmallButton onClick={addRegion}>+ Tambah region</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
