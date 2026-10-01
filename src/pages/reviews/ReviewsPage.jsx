import React, { useState, useEffect } from 'react'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { MessageCircle, Send, RefreshCw } from 'lucide-react'

export const ReviewsPage = () => {
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [reviews, setReviews] = useState([])
  const [overallRating, setOverallRating] = useState(5.0)
  const [loading, setLoading] = useState(true)
  const [replyingId, setReplyingId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await providerService.getReviews()
      if (res && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.reviews)
          ? res.data.reviews
          : []
        setReviews(list)
        if (res.data.overallRating !== undefined) {
          setOverallRating(Number(res.data.overallRating) || 5.0)
        }
      } else {
        setReviews([])
      }
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleOpenReply = (review) => {
    setReplyingId(review.id)
    setReplyText(review.reply || '')
  }

  const handleSubmitReply = async (reviewId) => {
    if (!replyText.trim()) {
      showToast('Please type your reply before sending.')
      return
    }

    setSubmittingReply(true)
    try {
      await providerService.replyReview(reviewId, replyText)
      showToast('Reply published successfully!')
      setReplyingId(null)
      setReplyText('')
      fetchReviews()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to submit reply.')
    } finally {
      setSubmittingReply(false)
    }
  }

  // Breakdown statistics
  const reviewList = Array.isArray(reviews) ? reviews : []
  const totalReviews = reviewList.length
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let sumRating = 0
  reviewList.forEach((r) => {
    const star = Math.min(Math.max(Math.round(Number(r.rating) || 5), 1), 5)
    starCounts[star] = (starCounts[star] || 0) + 1
    sumRating += Number(r.rating) || 5
  })
  const avgRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : overallRating.toFixed(1)

  return (
    <section id="reviews" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('reviewsTitle', 'Customer Reviews & Feedback')}</h1>
          <p className="page-subtitle">{t('reviewsSubtitle', 'Build trust with transparent client feedback for every celebration.')}</p>
        </div>
      </div>

      {/* Rating Summary Card */}
      {totalReviews === 0 ? (
        <div className="card" style={{ padding: '32px 24px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, color: '#f59e0b', marginBottom: 6 }}>★★★★★</div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: 16 }}>{t('noReviewsYet', 'No Customer Reviews Yet')}</h3>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
            Client ratings and feedback will appear here once bookings are completed on rjpm.in.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="rating-summary">
            <div>
              <div className="big-rating">{avgRating}</div>
              <div className="stars" style={{ fontSize: 24, color: '#f59e0b' }}>★</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 5 }}>
                {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            <div>
              {[5, 4, 3, 2, 1].map((s) => {
                const count = starCounts[s] || 0
                const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
                return (
                  <div key={s} className="rating-bar">
                    <span>{s}★</span>
                    <div className="bar">
                      <span style={{ width: `${percent}%` }}></span>
                    </div>
                    <span>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List Card */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 17 }}>Recent Customer Feedback</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
            <RefreshCw size={28} className="spin-animation" style={{ margin: '0 auto 8px' }} />
            <p>Loading reviews...</p>
          </div>
        ) : reviewList.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '30px 0' }}>
            No reviews submitted yet. When customers complete their event, their reviews will appear here.
          </p>
        ) : (
          <div>
            {reviewList.map((rev) => {
              const isReplying = replyingId === rev.id
              const customerName =
                (typeof rev.customer === 'string' ? rev.customer : rev.customer?.name) ||
                rev.userName ||
                rev.customer_name ||
                'Verified Client'
              const starNum = Math.min(Math.max(Math.round(Number(rev.rating) || 5), 1), 5)

              return (
                <div key={rev.id} className="review">
                  <div className="review-head">
                    <div>
                      <b>{customerName}</b>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString()
                          : rev.date || 'Recent Celebration'}
                      </div>
                    </div>
                    <span className="stars" style={{ fontSize: 16, color: '#f59e0b' }}>
                      {'★'.repeat(starNum)}
                    </span>
                  </div>

                  <p style={{ margin: '10px 0 12px 0' }}>{rev.comment}</p>

                  {/* Existing Reply */}
                  {rev.reply && !isReplying && (
                    <div
                      style={{
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderLeft: '3px solid var(--primary)',
                        borderRadius: 8,
                        fontSize: 13,
                        marginBottom: 10,
                      }}
                    >
                      <strong style={{ color: 'var(--primary)', display: 'block', fontSize: 12 }}>
                        Your public reply:
                      </strong>
                      <div style={{ marginTop: 3, color: '#334155' }}>{rev.reply}</div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {isReplying ? (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a polite response to thank the host or address feedback..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          fontSize: 13,
                          fontFamily: 'inherit',
                        }}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px' }}
                          onClick={() => setReplyingId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 14px' }}
                          disabled={submittingReply}
                          onClick={() => handleSubmitReply(rev.id)}
                        >
                          <Send size={13} /> {submittingReply ? 'Publishing...' : 'Publish Reply'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => handleOpenReply(rev)}
                    >
                      <MessageCircle size={13} /> {rev.reply ? 'Edit Reply' : 'Reply to Customer'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewsPage
