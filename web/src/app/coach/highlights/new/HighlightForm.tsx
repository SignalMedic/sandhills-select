'use client'

import { useActionState, useState } from 'react'

type ActionFn = (prev: string | null, formData: FormData) => Promise<string | null>

function getYouTubeId(url: string): string | null {
  return url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/
  )?.[1] ?? null
}

export default function HighlightForm({
  action,
  teams,
}: {
  action: ActionFn
  teams: { id: string; name: string }[]
}) {
  const [error, formAction, isPending] = useActionState(action, null)
  const [type, setType] = useState('text')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const ytId = type === 'video' ? getYouTubeId(videoUrl) : null

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Team
        </label>
        <select
          name="team_id"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
        >
          <option value="">Select team…</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Type
        </label>
        <div className="flex gap-2">
          {['text', 'photo', 'video'].map((t) => (
            <label
              key={t}
              className={`flex-1 text-center px-3 py-2 text-xs font-display font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${
                type === t
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-navy'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => { setType(t); setPhotoPreview(null); setVideoUrl('') }}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
          Caption
        </label>
        <textarea
          name="caption"
          required
          rows={4}
          placeholder="Describe the highlight…"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy resize-y"
        />
      </div>

      {type === 'photo' && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Photo <span className="normal-case font-normal text-gray-400">(JPEG, PNG, WebP — max 10 MB)</span>
          </label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            onChange={handlePhotoChange}
            className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-display file:font-bold file:uppercase file:tracking-wider file:bg-brand-navy file:text-white hover:file:bg-brand-navy-light"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="mt-3 rounded max-h-56 object-contain border border-gray-200"
            />
          )}
        </div>
      )}

      {type === 'video' && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-2">
            Video URL <span className="normal-case font-normal text-gray-400">(YouTube link)</span>
          </label>
          <input
            name="media_url"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy"
          />
          {videoUrl && !ytId && (
            <p className="mt-1 text-xs text-amber-600">Paste a YouTube link to see a preview.</p>
          )}
          {ytId && (
            <div className="mt-3 aspect-video rounded overflow-hidden border border-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="w-full h-full"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting…' : 'Submit for Review'}
      </button>
    </form>
  )
}
