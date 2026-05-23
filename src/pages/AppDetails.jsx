import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import {
  FaArrowLeft,
  FaDownload,
  FaRegImage,
  FaShareNodes,
  FaStar
} from 'react-icons/fa6'
import apps from '../data/apps'
import ReviewSection from '../components/ReviewSection'
import {
  formatCount,
  formatRating,
  recordDownload,
  useAppStats
} from '../hooks/useAppStats'

function SafeImage({ src, alt, className, fallback }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return fallback
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  )
}

function LogoFallback({ name }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-slate-100 text-2xl font-black text-slate-700 sm:h-28 sm:w-28">
      {initials}
    </div>
  )
}

function ScreenshotFallback({ index }) {
  return (
    <div className="grid aspect-[9/16] w-full place-items-center bg-slate-100 px-6 text-center">
      <div>
        <FaRegImage className="mx-auto mb-3 text-2xl text-slate-400" />
        <p className="text-sm font-bold text-slate-500">Screenshot {index + 1}</p>
      </div>
    </div>
  )
}

function AppDetails() {
  const { id } = useParams()
  const app = apps.find((item) => item.id === parseInt(id, 10))
  const appStats = useAppStats(apps)
  const stats = app ? appStats[app.id] : null

  if (!app) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">App not found</h1>
          <p className="mt-3 leading-7 text-slate-500">
            The app you opened is not available in this catalog.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white"
          >
            <FaArrowLeft />
            Back home
          </Link>
        </div>
      </main>
    )
  }

  const shareApp = async () => {
    if (navigator.share) {
      await navigator.share({
        title: app.name,
        text: app.description,
        url: window.location.href
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied')
    }
  }

  const handleDownload = () => {
    recordDownload(app.id).catch((error) => {
      console.error('Failed to record download:', error)
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-slate-950"
          >
            <FaArrowLeft />
            Apps
          </Link>

          <button
            onClick={shareApp}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            <FaShareNodes />
            Share
          </button>
        </nav>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <SafeImage
              src={app.logo}
              alt={app.name}
              className="h-24 w-24 shrink-0 rounded-3xl border border-slate-200 bg-white object-cover shadow-sm sm:h-28 sm:w-28"
              fallback={<LogoFallback name={app.name} />}
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                {app.name}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                {app.longDescription}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-lg font-black">
                    <FaStar className="text-amber-400" />
                    {formatRating(stats?.averageRating || 0, stats?.reviewCount || 0)}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    {stats?.reviewCount || 0} reviews
                  </p>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div>
                  <p className="inline-flex items-center gap-1.5 text-lg font-black">
                    <FaDownload className="text-slate-500" />
                    {formatCount(stats?.installCount || 0)}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">installs</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={app.apk}
                  download
                  onClick={handleDownload}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <FaDownload />
                  Download APK
                </a>
                <button
                  onClick={shareApp}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                >
                  <FaShareNodes />
                  Share app
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Screenshots</h2>
              <p className="mt-1 text-sm text-slate-500">Swipe through app screens.</p>
            </div>
          </div>

          <Swiper
            spaceBetween={16}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.6 }
            }}
          >
            {app.screenshots.map((image, index) => (
              <SwiperSlide key={image}>
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="overflow-hidden rounded-[1.25rem] bg-slate-100">
                    <SafeImage
                      src={image}
                      alt={`${app.name} screenshot ${index + 1}`}
                      className="aspect-[9/16] w-full object-cover"
                      fallback={<ScreenshotFallback index={index} />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <ReviewSection appId={app.id} />
      </div>
    </main>
  )
}

export default AppDetails
