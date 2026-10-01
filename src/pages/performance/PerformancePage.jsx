import React, { useState, useEffect } from 'react'
import { providerService } from '../../services/providerService'
import { TrendingUp, MessageSquare, CheckCircle, Eye, RefreshCw } from 'lucide-react'

export const PerformancePage = () => {
  const [data, setData] = useState({
    totalEnquiries: 0,
    bookings: 0,
    conversion: '0%',
    profileViews: 0,
    monthlyActivity: [],
    topServices: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true)
      try {
        const res = await providerService.getPerformance()
        if (res.data) {
          setData((prev) => ({
            ...prev,
            totalEnquiries: res.data.totalEnquiries || 0,
            bookings: res.data.bookings || 0,
            conversion: res.data.conversion || '0%',
            profileViews: res.data.profileViews || 0,
            monthlyActivity: res.data.monthlyActivity || res.data.monthlyEnquiries || [],
            topServices: res.data.topServices || [],
          }))
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchPerformance()
  }, [])

  return (
    <section id="performance" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Performance Analytics</h1>
          <p className="page-subtitle">See which listings attract customers and generate confirmed bookings.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats">
        <div className="card stat">
          <span className="stat-label">Total enquiries</span>
          <div className="stat-value">{data.totalEnquiries}</div>
          <div className="delta">{data.totalEnquiries > 0 ? 'Active inquiries' : 'No enquiries yet'}</div>
        </div>

        <div className="card stat">
          <span className="stat-label">Confirmed bookings</span>
          <div className="stat-value">{data.bookings}</div>
          <div className="delta">{data.bookings > 0 ? 'Confirmed celebrations' : 'No bookings yet'}</div>
        </div>

        <div className="card stat">
          <span className="stat-label">Lead conversion</span>
          <div className="stat-value">{data.conversion}</div>
          <div className="delta">{data.totalEnquiries > 0 ? 'Conversion rate' : 'Ready for leads'}</div>
        </div>

        <div className="card stat">
          <span className="stat-label">Profile views</span>
          <div className="stat-value">{Number(data.profileViews).toLocaleString('en-IN')}</div>
          <div className="delta">{data.profileViews > 0 ? 'Marketplace views' : 'Fresh profile'}</div>
        </div>
      </div>

      {/* Monthly Enquiries Bar Chart */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 17 }}>Monthly Enquiries Trend</h3>
        {data.monthlyActivity.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0', margin: 0 }}>
            No trend data recorded yet. As enquiries arrive over time, monthly trends will chart here.
          </p>
        ) : (
          <div className="chart">
            {data.monthlyActivity.map((m) => (
              <div key={m.month} className="bar-col">
                <div
                  className="bar-value"
                  style={{ height: `${Math.min(m.enquiries || m.count || 0, 200)}px` }}
                  title={`${m.month}: ${m.enquiries || m.count || 0} enquiries`}
                />
                <span>{m.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Services Table */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 17 }}>Top Performing Services</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Impressions / Views</th>
                <th>Enquiries</th>
                <th>Confirmed Bookings</th>
              </tr>
            </thead>
            <tbody>
              {data.topServices.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                    No service performance data yet. Publish your services to track views and customer responses.
                  </td>
                </tr>
              ) : (
                data.topServices.map((svc) => (
                  <tr key={svc.name || svc.service}>
                    <td>
                      <strong>{svc.name || svc.service}</strong>
                    </td>
                    <td>{svc.views || 0}</td>
                    <td>{svc.enquiries || 0}</td>
                    <td>
                      <span style={{ color: '#16834a', fontWeight: 700 }}>{svc.bookings || 0}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
