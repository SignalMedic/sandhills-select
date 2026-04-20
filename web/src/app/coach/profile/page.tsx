import { requireCoach } from '@/lib/supabase/auth'
import ProfileForm from './ProfileForm'
import { updateProfile } from './actions'

export const metadata = { title: 'Profile — Coach Portal' }

export default async function CoachProfilePage() {
  const profile = await requireCoach()

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-display font-bold text-brand-navy text-3xl uppercase mb-8">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg">
        <h2 className="font-display font-bold text-brand-navy text-lg uppercase mb-4">Your Info</h2>
        <div className="mb-4">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-gray-500 mb-1">Email</p>
          <p className="text-sm text-gray-700">{profile.email}</p>
        </div>
        <ProfileForm action={updateProfile} currentName={profile.full_name} />
      </div>
    </div>
  )
}
