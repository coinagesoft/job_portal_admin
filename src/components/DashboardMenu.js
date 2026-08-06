'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  Wallet,
  BadgeDollarSign,
  MonitorCog,
  UserCog,
  Headphones,
  FileText,
   Scale,
  Settings,
  LogOut
} from "lucide-react";
import { useEffect, useState } from 'react';
const navItems = [
  { href: '/admin/dashboard', icon: '/assets/imgs/page/dashboard/dashboard.svg', name: 'Dashboard', accessKey: 'dashboard' },
  { href: '/admin/candidates', icon: '/assets/imgs/page/dashboard/candidates.svg', name: 'Candidates', accessKey: 'candidates.view' },
  { href: '/admin/recruiters', icon: '/assets/imgs/page/dashboard/recruiters.svg', name: 'Recruiters', accessKey: 'recruiters.view' },
  // { href: '/admin/verifications', icon: '/assets/imgs/page/dashboard/jobs.svg', name: 'Verifications' },
  { href: '/admin/revenue', icon: '/assets/imgs/page/dashboard/tasks.svg', name: 'Revenue', accessKey: 'revenue.view' },
  { href: '/admin/Plans', icon: BadgeDollarSign, name: 'Plans', accessKey: 'plans.view' },
  { href: '/admin/homepage-management', icon: MonitorCog, name: 'Home Management' },
  { href: '/admin/users', icon: '/assets/imgs/page/dashboard/profiles.svg', name: 'Users', accessKey: 'subadmin.view' },
  { href: '/admin/helpAndsupport', icon:Headphones, name: 'Help & Support', accessKey: 'support.view' },
  { href: '/admin/audit', icon: FileText, name: 'Audit Logs', accessKey: 'audit.view' },
{ href: '/admin/managePolicies', icon:  Scale, name: 'Legal Pages', accessKey: 'legal.view' },
  { href: '/admin/settings', icon: '/assets/imgs/page/dashboard/settings.svg', name: 'Settings', accessKey: 'settings.view' },
  { href: '/', icon: '/assets/imgs/page/dashboard/logout.svg', name: 'Logout' },
];

export default function DashboardMenu() {
  const pathname = usePathname();
  const [subAdminAccess, setSubAdminAccess] = useState(null);

  useEffect(() => {
    const readAccess = () => {
      try {
        const session = JSON.parse(window.localStorage.getItem('jobbox_active_subadmin') || 'null');
        setSubAdminAccess(session?.status === 'Active' && Array.isArray(session.access) ? session.access : null);
      } catch { setSubAdminAccess(null); }
    };
    readAccess();
    window.addEventListener('storage', readAccess);
    return () => window.removeEventListener('storage', readAccess);
  }, []);

  const isActive = (href) => {
    // exact match
    if (pathname === href) return true;

    // sub routes match (IMPORTANT)
    if (pathname.startsWith(href + '/')) return true;

    return false;
  };
  const visibleNavItems = subAdminAccess === null
    ? navItems
    : navItems.filter((item) => !item.accessKey || subAdminAccess.includes(item.accessKey));

return (
  <div className="nav">
    {/* Menu */}
    <nav className="nav-main-menu">
      <ul className="main-menu">
        {visibleNavItems.map((item) => (
          <li key={item.href}>
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
