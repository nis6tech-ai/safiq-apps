import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaAndroid, FaArrowRight, FaDownload, FaLayerGroup, FaStar } from 'react-icons/fa6'
import apps from '../data/apps'
import { formatCount, formatRating, useAppStats } from '../hooks/useAppStats'

function AppLogo({ app }) {
  const [hasError, setHasError] = useState(false)
  const initials = app.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  if (hasError) {
    return (
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg font-black text-slate-700">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={app.logo}
      alt={app.name}
      onError={() => setHasError(true)}
      className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-cover shadow-sm"
    />
  )
}

function Home() {
  const appStats = useAppStats(apps)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white">
              <FaLayerGroup />
            </div>
            <div>
              <h1 className="text-lg font-black leading-none tracking-tight">Mohammed Safiq Nishar Apps</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">Android & iOS Apps</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm sm:flex">
            <FaAndroid className="text-emerald-600" />
            {apps.length} apps
          </div>
        </header>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">Apps</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Available downloads</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Browse apps, check ratings, preview screenshots, and download APK files.
            </p>
          </div>

          <div className="grid gap-4">
            {apps.map((app) => {
              const stats = appStats[app.id] || {
                averageRating: 0,
                reviewCount: 0,
                installCount: 0
              }

              return (
                <Link
                  to={`/app/${app.id}`}
                  key={app.id}
                  className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <AppLogo app={app} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-black tracking-tight text-slate-950">{app.name}</h3>
                          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{app.description}</p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700">
                          <FaAndroid />
                          APK
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-black text-slate-800">
                          <FaStar className="text-amber-400" />
                          {formatRating(stats.averageRating, stats.reviewCount)}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-slate-500">
                          {stats.reviewCount} reviews
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                          <FaDownload className="text-slate-400" />
                          {formatCount(stats.installCount)} installs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                      <span className="text-sm font-black text-slate-950">Details</span>
                      <FaArrowRight className="ml-3 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-950" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
