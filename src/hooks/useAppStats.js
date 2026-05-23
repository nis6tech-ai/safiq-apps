import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

function emptyStats(apps) {
  return apps.reduce((stats, app) => {
    stats[app.id] = {
      averageRating: 0,
      reviewCount: 0,
      installCount: 0
    }

    return stats
  }, {})
}

function formatCount(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }

  return String(count)
}

function formatRating(rating, reviewCount) {
  if (!reviewCount) {
    return 'New'
  }

  return rating.toFixed(1)
}

export function useAppStats(apps) {
  const [reviews, setReviews] = useState([])
  const [downloads, setDownloads] = useState([])

  useEffect(() => {
    const unsubscribeReviews = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        setReviews(snapshot.docs.map((doc) => doc.data()))
      },
      (error) => {
        console.error('Failed to subscribe to reviews:', error)
      }
    )

    const unsubscribeDownloads = onSnapshot(
      collection(db, 'downloads'),
      (snapshot) => {
        setDownloads(snapshot.docs.map((doc) => doc.data()))
      },
      (error) => {
        console.error('Failed to subscribe to downloads:', error)
      }
    )

    return () => {
      unsubscribeReviews()
      unsubscribeDownloads()
    }
  }, [])

  return useMemo(() => {
    const stats = emptyStats(apps)

    reviews.forEach((review) => {
      const appStats = stats[review.appId]

      if (!appStats || typeof review.rating !== 'number') {
        return
      }

      appStats.averageRating += review.rating
      appStats.reviewCount += 1
    })

    Object.values(stats).forEach((appStats) => {
      if (appStats.reviewCount > 0) {
        appStats.averageRating = appStats.averageRating / appStats.reviewCount
      }
    })

    downloads.forEach((download) => {
      const appStats = stats[download.appId]

      if (appStats) {
        appStats.installCount += 1
      }
    })

    return stats
  }, [apps, reviews, downloads])
}

export async function recordDownload(appId) {
  await addDoc(collection(db, 'downloads'), {
    appId,
    createdAt: serverTimestamp()
  })
}

export { formatCount, formatRating }
