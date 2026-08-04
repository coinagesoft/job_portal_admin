'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  Wallet,
  UserCog,
  Headphones,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import { useEffect, useState } from 'react';
const navItems = [
  { href: '/admin/dashboard', icon: '/assets/imgs/page/dashboard/dashboard.svg', name: 'Dashboard' },
  { href: '/admin/candidates', icon: '/assets/imgs/page/dashboard/candidates.svg', name: 'Candidates' },
  { href: '/admin/recruiters', icon: '/assets/imgs/page/dashboard/recruiters.svg', name: 'Recruiters' },
  // { href: '/admin/verifications', icon: '/assets/imgs/page/dashboard/jobs.svg', name: 'Verifications' },
  { href: '/admin/finance', icon: '/assets/imgs/page/dashboard/tasks.svg', name: 'Finance' },
  { href: '/admin/subadmin', icon: '/assets/imgs/page/dashboard/profiles.svg', name: 'Sub-Admin' },
  { href: '/admin/helpAndsupport', icon:Headphones, name: 'Help & Support' },
  { href: '/admin/audit', icon: FileText, name: 'Audit Logs' },
  { href: '/admin/settings', icon: '/assets/imgs/page/dashboard/settings.svg', name: 'Settings' },
  { href: '/', icon: '/assets/imgs/page/dashboard/logout.svg', name: 'Logout' },
];

export default function DashboardMenu() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href) => {
    // exact match
    if (pathname === href) return true;

    // sub routes match (IMPORTANT)
    if (pathname.startsWith(href + '/')) return true;

    return false;
  };
  useEffect(() => {
  const mainEl = document.querySelector('.main');
  if (!mainEl) return;

  if (collapsed) {
    mainEl.classList.add('nav-close');
  } else {
    mainEl.classList.remove('nav-close');
  }
}, [collapsed]);

return (
  <div className="nav">

    {/* Toggle Button */}
    <a
      className={`btn btn-expanded${collapsed ? ' btn-collapsed' : ''}`}
      onClick={() => setCollapsed(!collapsed)}
      style={{ cursor: 'pointer' }}
    />

    {/* Menu */}
    <nav className="nav-main-menu">
      <ul className="main-menu">
        {navItems.map((item) => (
          <li key={item.href} title={collapsed ? item.name : undefined}>
            <Link
              href={item.href}
              className={`dashboard2 ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="menu-icon">
                {typeof item.icon === 'string' ? (
                  <img src={item.icon} alt={item.name} />
                ) : (
                  <item.icon size={20} strokeWidth={2.2} />
                )}
              </span>

              <span className="name">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>

  </div>
);
}