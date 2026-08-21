import { redirect } from 'next/navigation';
import { isLoggedIn } from '@/lib/session';

const MENU = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/dashboard/hero', label: 'Hero / Banner' },
  { href: '/admin/dashboard/about', label: 'Tentang Kami' },
  { href: '/admin/dashboard/visimisi', label: 'Visi & Misi' },
  { href: '/admin/dashboard/layanan', label: 'Layanan' },
  { href: '/admin/dashboard/servis', label: 'Program Servis' },
  { href: '/admin/dashboard/ekspansi', label: 'Ekspansi' },
  { href: '/admin/dashboard/kontak', label: 'Kontak' },
  { href: '/admin/dashboard/berita', label: 'Berita' },
];

export default async function DashboardLayout({ children }) {
  if (!(await isLoggedIn())) {
    redirect('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif', background: '#f4f5f7' }}>
      <aside style={{ width: 240, background: '#1e2a6e', color: '#fff', padding: '1.5rem 1rem', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Fortune Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MENU.map((m) => (
            <a
              key={m.href}
              href={m.href}
              style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 4, fontSize: '0.85rem' }}
            >
              {m.label}
            </a>
          ))}
          <a
            href="/api/auth?action=logout"
            style={{ color: '#ffb4b4', textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 4, fontSize: '0.85rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}
          >
            Logout
          </a>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
    </div>
  );
}
