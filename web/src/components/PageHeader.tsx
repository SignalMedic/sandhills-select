export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <section className="bg-brand-navy text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-brand-red font-display font-bold uppercase tracking-widest text-sm mb-1">
          {eyebrow}
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-blue-200 text-lg max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
