'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import DashboardMenu from '../../components/DashboardMenu';
import { authService } from '../../services/authService';
import { subAdminService } from '../../services/subAdminService';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Sync profile on mount
  useEffect(() => {
    const fetchProfileAndVerify = async () => {
      try {
        console.log('layout: fetchProfileAndVerify running...');
        const response = await authService.getCurrentUser();
        console.log('layout: getCurrentUser response:', response);
        const adminData = response?.admin || response?.item || response?.data || response;
        console.log('layout: extracted adminData:', adminData);
        if (adminData && adminData.adminType) {
          let permissionsObject = {};

          // Try to fetch sub-admins list to get the actual permissions object from the database
          try {
            const subAdminsRes = await subAdminService.getSubAdmins({ pageSize: 100 });
            if (subAdminsRes && subAdminsRes.items) {
              const currentSubAdmin = subAdminsRes.items.find(item => item.email === adminData.email || item.adminId === adminData.adminId);
              if (currentSubAdmin && currentSubAdmin.permissions) {
                permissionsObject = currentSubAdmin.permissions;
                console.log('layout: successfully synced permissions from sub-admin list:', permissionsObject);
              }
            }
          } catch (subAdminErr) {
            console.warn('layout: could not fetch sub-admin list (likely restricted):', subAdminErr);
          }

          // Fallback to role preset permissions if permissions object remains empty
          if (Object.keys(permissionsObject).length === 0) {
            const roleName = adminData.roleName || adminData.role;
            if (roleName === 'Finance Admin') {
              permissionsObject = { revenue: true };
            } else if (roleName === 'Verification Officer') {
              permissionsObject = { dashboard: true, candidates: true, recruiters: true };
            } else if (roleName === 'Employer Manager') {
              permissionsObject = { dashboard: true, recruiters: true };
            } else if (roleName === 'Read Only') {
              permissionsObject = { dashboard: true, candidates: true, recruiters: true, revenue: true, plans: true };
            } else {
              // Otherwise, if the server permissions is an array, convert it to object if it has strings
              if (Array.isArray(adminData.permissions)) {
                adminData.permissions.forEach(p => {
                  permissionsObject[p] = true;
                });
              } else if (typeof adminData.permissions === 'object') {
                permissionsObject = adminData.permissions || {};
              }
            }
          }

          const adminInfo = {
            name: adminData.fullName || 'Admin User',
            email: adminData.email,
            adminType: adminData.adminType,
            permissions: permissionsObject,
          };
          window.localStorage.setItem('jobbox_logged_in_admin', JSON.stringify(adminInfo));
          if (adminData.adminType !== 'SubAdmin') {
            window.localStorage.setItem('jobbox_superadmin', JSON.stringify(adminInfo));
          }
          // Dispatch event to sync Header
          window.dispatchEvent(new CustomEvent('jobbox-superadmin-updated', { detail: adminInfo }));
        }
      } catch (err) {
        console.error('layout: Failed to sync logged-in admin profile:', err);
      } finally {
        setProfileLoaded(true);
      }
    };

    fetchProfileAndVerify();
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;

    const checkAccess = () => {
      try {
        console.log('layout: checkAccess checking route:', pathname);
        if (pathname.startsWith('/admin/profile')) {
          console.log('layout: profile page blocked.');
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const saved = JSON.parse(window.localStorage.getItem('jobbox_logged_in_admin') || window.localStorage.getItem('jobbox_superadmin') || 'null');
        console.log('layout: checkAccess loaded saved info:', saved);
        if (saved && saved.adminType === 'SubAdmin') {
          const perms = saved.permissions || {};
          
          // Map path prefixes to permission keys
          const pathPermissionMap = [
            { prefix: '/admin/dashboard', key: 'dashboard' },
            { prefix: '/admin/candidates', key: 'candidates' },
            { prefix: '/admin/recruiters', key: 'recruiters' },
            { prefix: '/admin/verifications', key: 'recruiters' },
            { prefix: '/admin/revenue', key: 'revenue' },
            { prefix: '/admin/Plans', key: 'plans' },
            { prefix: '/admin/homepage-management', key: 'home_management' },
            { prefix: '/admin/users', key: 'users' },
            { prefix: '/admin/helpAndsupport', key: 'help_support' },
            { prefix: '/admin/audit', key: 'audit_logs' },
            { prefix: '/admin/managePolicies', key: 'legal_pages' },
            { prefix: '/admin/settings', key: 'settings' }
          ];

          const matched = pathPermissionMap.find(item => pathname.startsWith(item.prefix));
          if (matched) {
            if (!perms[matched.key]) {
              setAuthorized(false);
              setLoading(false);
              return;
            }
          }
        }
        setAuthorized(true);
        setLoading(false);
      } catch (e) {
        setAuthorized(true);
        setLoading(false);
      }
    };

    checkAccess();
  }, [pathname, profileLoaded]);

  return (
    <>
      <Header/>
      <main className="main">
        <DashboardMenu />

        <div className="box-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #ff9900',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : authorized ? (
            children
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '60vh', 
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
              margin: '20px'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '20px'
              }}>🔒</div>
              <h2 style={{ color: '#122359', fontWeight: '700', marginBottom: '10px' }}>Access Denied</h2>
              <p style={{ color: '#666', maxWidth: '400px', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
                You do not have permission to access this page. Please contact your system administrator if you believe this is an error.
              </p>
              <button 
                onClick={() => {
                  try {
                    const saved = JSON.parse(window.localStorage.getItem('jobbox_logged_in_admin') || window.localStorage.getItem('jobbox_superadmin') || 'null');
                    if (saved && saved.adminType === 'SubAdmin') {
                      const perms = saved.permissions || {};
                      const routeOrder = [
                        { key: 'dashboard', path: '/admin/dashboard' },
                        { key: 'candidates', path: '/admin/candidates' },
                        { key: 'recruiters', path: '/admin/recruiters' },
                        { key: 'revenue', path: '/admin/revenue' },
                        { key: 'plans', path: '/admin/Plans' },
                        { key: 'home_management', path: '/admin/homepage-management' },
                        { key: 'users', path: '/admin/users' },
                        { key: 'help_support', path: '/admin/helpAndsupport' },
                        { key: 'audit_logs', path: '/admin/audit' },
                        { key: 'legal_pages', path: '/admin/managePolicies' },
                        { key: 'settings', path: '/admin/settings' }
                      ];
                      const firstAllowed = routeOrder.find(r => perms[r.key] === true);
                      if (firstAllowed) {
                        router.push(firstAllowed.path);
                        return;
                      }
                    }
                  } catch (e) {}
                  router.push('/');
                }}
                style={{
                  background: '#ff9900',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 14px rgba(255,153,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e68a00';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ff9900';
                  e.target.style.transform = 'none';
                }}
              >
                Go to Allowed Section
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}