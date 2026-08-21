'use client';

import { useEffect, useState } from 'react';
import { Card, Field, TextArea, SaveButton, StatusMessage, Loading, SmallButton } from '@/components/admin/AdminUI';

export default function VisiMisiAdminPage() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/content?section=visimisi').then((r) => r.json()).then((d) => setData(d.error ? { missions: [] } : d));
  }, []);

  if (!data) return <Loading />;

  const setMission = (i, v) => setData((d) => { const m = [...d.missions]; m[i] = v; return { ...d, missions: m }; });
  const addMission = () => setData((d) => ({ ...d, missions: [...(d.missions || []), ''] }));
  const removeMission = (i) => setData((d) => ({ ...d, missions: d.missions.filter((_, idx) => idx !== i) }));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await fetch('/api/content?section=visimisi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await res.json();
    setSaving(false);
    setStatus(result.success ? { type: 'ok', message: 'Perubahan tersimpan.' } : { type: 'error', message: result.error || 'Gagal menyimpan.' });
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Visi &amp; Misi</h1>
      <Card>
        <Field label="Visi">
          <TextArea rows={3} value={data.vision || ''} onChange={(e) => setData((d) => ({ ...d, vision: e.target.value }))} />
        </Field>
      </Card>

      <Card title="Misi">
        {(data.missions || []).map((m, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <TextArea rows={2} value={m} onChange={(e) => setMission(i, e.target.value)} />
            <div style={{ marginTop: '0.35rem' }}>
              <SmallButton danger onClick={() => removeMission(i)}>Hapus misi {i + 1}</SmallButton>
            </div>
          </div>
        ))}
        <SmallButton onClick={addMission}>+ Tambah misi</SmallButton>
      </Card>

      <SaveButton onClick={save} saving={saving} />
      <StatusMessage status={status} />
    </div>
  );
}
