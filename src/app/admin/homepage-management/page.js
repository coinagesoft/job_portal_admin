"use client"

import HomePageManagement from '../../../components/HomePageManagement'

export default function HomePageManagementPage() {
  return (
    <div className="homepage-management-page">
      <div className="box-heading homepage-management-heading">
        <div className="box-title">
          <h3 className="mb-5">Home Page Management</h3>
          <p className="font-sm color-text-paragraph-2 mb-0">Manage the candidate-facing content displayed across the public home page.</p>
        </div>
        <div className="box-breadcrumb">
          <div className="breadcrumbs" style={{ border: 'none', backgroundColor: 'revert' }}>
            <ul>
              <li><a className="icon-home" href="/admin/dashboard">Admin</a></li>
              <li><span>Home Page Management</span></li>
            </ul>
          </div>
        </div>
      </div>
      <HomePageManagement />
      <style jsx>{`.homepage-management-heading { margin-bottom: 24px; }`}</style>
    </div>
  )
}
