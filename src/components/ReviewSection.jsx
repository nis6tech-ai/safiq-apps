import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore'
import { FaPaperPlane, FaRegMessage, FaStar } from 'react-icons/fa6'
import { db } from '../firebase/firebase'

function StarRatingInput({ rating, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} star rating`}
          className="rounded-full p-1 text-2xl transition hover:scale-110"
        >
          <FaStar className={star <= rating ? 'text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  )
}

function ReviewStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? 'text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  )
}

function ReviewSection({ appId }) {
  const [reviews, setReviews] = useState([])
  const [name, setName] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(5)

  useEffect(() => {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('appId', '==', appId)
    )

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const nextReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        setReviews(nextReviews)
      },
      (error) => {
        console.error('Failed to load reviews:', error)
      }
    )

    return unsubscribe
  }, [appId])

  const submitReview = async (e) => {
    e.preventDefault()

    if (!name.trim() || !review.trim()) {
      return alert('Fill all fields')
    }

    await addDoc(collection(db, 'reviews'), {
      appId,
      name: name.trim(),
      review: review.trim(),
      rating,
      createdAt: serverTimestamp()
    })

    setName('')
    setReview('')
    setRating(5)
  }

  return (
    <section className="border-t border-slate-200 py-9">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Ratings & Reviews</h2>
          <p className="mt-1 text-sm text-slate-500">
            Ratings update automatically as users submit reviews.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm">
          {reviews.length} reviews
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={submitReview}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <label className="mb-2 block text-sm font-black text-slate-700">
            Your rating
          </label>
          <div className="mb-5">
            <StarRatingInput rating={rating} onChange={setRating} />
          </div>

          <label className="mb-2 block text-sm font-black text-slate-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
          />

          <label className="mb-2 block text-sm font-black text-slate-700">
            Review
          </label>
          <textarea
            placeholder="Write your review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="mb-4 h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
          />

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <FaPaperPlane />
            Submit Review
          </button>
        </form>

        <div className="space-y-3">
          {reviews.length === 0 && (
            <div className="grid min-h-64 place-items-center rounded-[2rem] border border-dashed border-slate-300 bg-white p-6 text-center">
              <div>
                <FaRegMessage className="mx-auto mb-4 text-3xl text-slate-300" />
                <p className="font-black text-slate-800">No reviews yet</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Be the first to rate this app.
                </p>
              </div>
            </div>
          )}

          {reviews.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">{item.name}</h3>
                  <div className="mt-1">
                    <ReviewStars rating={item.rating} />
                  </div>
                </div>
                <span className="text-sm font-black text-slate-500">
                  {item.rating}.0
                </span>
              </div>

              <p className="leading-7 text-slate-600">{item.review}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewSection
