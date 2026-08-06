import { redirect } from 'next/navigation'

export default function SubAdminRedirect() {
  redirect('/admin/users')
}
