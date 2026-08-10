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
  { href: '/admin/candidates', icon: '/assets/imgs/page/dashboard/candidates.svg', name: 'Candidates', accessKey: 'candidates' },
  { href: '/admin/recruiters', icon: '/assets/imgs/page/dashboard/recruiters.svg', name: 'Recruiters', accessKey: 'recruiters' },
  // { href: '/admin/verifications', icon: '/assets/imgs/page/dashboard/jobs.svg', name: 'Verifications' },
  { href: '/admin/revenue', icon: '/assets/imgs/page/dashboard/tasks.svg', name: 'Revenue', accessKey: 'revenue' },
  { href: '/admin/Plans', icon: BadgeDollarSign, name: 'Plans', accessKey: 'plans' },
  { href: '/admin/homepage-management', icon: MonitorCog, name: 'Home Management', accessKey: 'home_management' },
  { href: '/admin/users', icon: '/assets/imgs/page/dashboard/profiles.svg', name: 'Users', accessKey: 'users' },
  { href: '/admin/helpAndsupport', icon: Headphones, name: 'Help & Support', accessKey: 'help_support' },
  { href: '/admin/audit', icon: FileText, name: 'Audit Logs', accessKey: 'audit_logs' },
  { href: '/admin/managePolicies', icon: Scale, name: 'Legal Pages', accessKey: 'legal_pages' },
  { href: '/admin/settings', icon: '/assets/imgs/page/dashboard/settings.svg', name: 'Settings', accessKey: 'settings' },
  { href: '/', icon: '/assets/imgs/page/dashboard/logout.svg', name: 'Logout' },
];

export default function DashboardMenu() {
  const pathname = usePathname();
  const [subAdminAccess, setSubAdminAccess] = useState(null);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    const readAccess = () => {
      try {
        const adminData = JSON.parse(window.localStorage.getItem('jobbox_logged_in_admin') || window.localStorage.getItem('jobbox_superadmin') || 'null');
        if (adminData && adminData.adminType === 'SubAdmin') {
          setPermissions(adminData.permissions || {});
          setSubAdminAccess(null);
          return;
        }

        const session = JSON.parse(window.localStorage.getItem('jobbox_active_subadmin') || 'null');
        if (session?.status === 'Active' && Array.isArray(session.access)) {
          setSubAdminAccess(session.access);
          setPermissions(null);
        } else {
          setSubAdminAccess(null);
          setPermissions(null);
        }
      } catch {
        setSubAdminAccess(null);
        setPermissions(null);
      }
    };
    readAccess();
    window.addEventListener('storage', readAccess);
    window.addEventListener('jobbox-superadmin-updated', readAccess);
    return () => {
      window.removeEventListener('storage', readAccess);
      window.removeEventListener('jobbox-superadmin-updated', readAccess);
    };
  }, []);

  const isActive = (href) => {
    // Keep Recruiters active for all recruiter-related pages
    if (href === "/admin/recruiters") {
      return (
        pathname.startsWith("/admin/recruiters") ||
        pathname.startsWith("/admin/verifications")
      );
    }

    // Exact match
    if (pathname === href) return true;

    // Child routes
    if (pathname.startsWith(href + "/")) return true;

    return false;
  };

  const visibleNavItems = navItems.filter((item) => {
    if (permissions) {
      if (!item.accessKey) return true;
      return !!permissions[item.accessKey];
    }
    if (subAdminAccess) {
      if (!item.accessKey) return true;
      const legacyMap = {
        'dashboard': 'dashboard',
        'candidates': 'candidates.view',
        'recruiters': 'recruiters.view',
        'revenue': 'revenue.view',
        'plans': 'plans.view',
        'home_management': 'home_management',
        'users': 'subadmin.view',
        'help_support': 'support.view',
        'audit_logs': 'audit.view',
        'legal_pages': 'legal.view',
        'settings': 'settings.view',
      };
      const legacyKey = legacyMap[item.accessKey] || item.accessKey;
      return subAdminAccess.includes(legacyKey);
    }
    return true;
  });

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
