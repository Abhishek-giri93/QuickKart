import React, { useState, useEffect } from 'react';
import { adminApi } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample Sellers with Verification actions
  const [sellers, setSellers] = useState([
    { id: 'SEL-101', name: 'Fresh Basket Supermart', category: 'Grocery', owner: 'Ramesh Patel', phone: '+91 98210 11223', fssai: '22819001294812', status: 'Approved', orders: 124 },
    { id: 'SEL-102', name: 'Spice Garden Restaurant', category: 'Restaurant', owner: 'Vikram Seth', phone: '+91 98450 88219', fssai: '11220003491823', status: 'Pending Review', orders: 0 },
    { id: 'SEL-103', name: 'Bhopal Bakery & Dairy', category: 'Bakery', owner: 'Sunita Jain', phone: '+91 97110 33492', fssai: '10018022004812', status: 'Pending Review', orders: 0 },
    { id: 'SEL-104', name: 'Quick Bites Fast Food', category: 'Fast Food', owner: 'Mohd. Imran', phone: '+91 99200 44102', fssai: '22019005819201', status: 'Approved', orders: 89 },
  ]);

  // Live Orders
  const [orders] = useState([
    { id: 'QK-9214', customer: 'Rahul Verma', store: 'Fresh Basket Supermart', items: '2x Milk, 1x Salt', amount: '₹152', rider: 'Ramesh (🛵)', status: 'On The Way', time: '5m ago' },
    { id: 'QK-9215', customer: 'Priya Sharma', store: 'Spice Garden', items: '1x Paneer Tikka, 2x Naan', amount: '₹340', rider: 'Searching...', status: 'Preparing', time: '12m ago' },
    { id: 'QK-9210', customer: 'Ananya Roy', store: 'Fresh Basket Supermart', items: '1x Atta 5kg', amount: '₹235', rider: 'Vikram (🛵)', status: 'Delivered', time: '42m ago' },
    { id: 'QK-9204', customer: 'Aman Deep', store: 'Quick Bites', items: '2x Veg Burger', amount: '₹180', rider: 'Raju (🛵)', status: 'Delivered', time: '1h ago' },
  ]);

  // Delivery Fleet
  const [riders] = useState([
    { id: 'RD-01', name: 'Ramesh Kumar', vehicle: 'Splendor (MP 04 AB 4912)', zone: 'Arera Colony', activeShift: 'Online 🟢', completed: 9, rating: '⭐ 4.9' },
    { id: 'RD-02', name: 'Vikram Singh', vehicle: 'Activa (MP 04 CZ 1823)', zone: 'MP Nagar', activeShift: 'On Delivery 🛵', completed: 14, rating: '⭐ 4.8' },
    { id: 'RD-03', name: 'Raju Sharma', vehicle: 'Pulsar (MP 04 EF 9128)', zone: 'Kolar Road', activeShift: 'Online 🟢', completed: 7, rating: '⭐ 4.7' },
    { id: 'RD-04', name: 'Imran Khan', vehicle: 'Platina (MP 04 KL 3019)', zone: 'New Market', activeShift: 'Offline 🔴', completed: 11, rating: '⭐ 4.6' },
  ]);

  // Coupons
  const [coupons] = useState([
    { code: 'QUICK50', discount: '₹50 OFF', minOrder: '₹199', usedCount: 842, status: 'Active' },
    { code: 'WELCOME100', discount: '₹100 OFF', minOrder: '₹299', usedCount: 1204, status: 'Active' },
    { code: 'FREEDEL', discount: 'Free Delivery', minOrder: '₹149', usedCount: 2319, status: 'Active' },
  ]);

  // Live Platform KPI Metrics
  const [metrics, setMetrics] = useState({
    gmv: '₹2,48,920',
    ordersToday: '1,428',
    activeStores: '142',
    ridersOnDuty: '68',
  });

  useEffect(() => {
    adminApi.getOverview()
      .then((res) => {
        if (res?.data) {
          setMetrics({
            gmv: `₹${(res.data.gmv || 0).toLocaleString('en-IN')}`,
            ordersToday: `${res.data.ordersToday || 0}`,
            activeStores: `${res.data.activeStores || 0}`,
            ridersOnDuty: `${res.data.activeRiders || 0}`,
          });
        }
      })
      .catch(() => {
        // Retain initial mock values if backend is offline
      });
  }, []);

  const handleVerifySeller = async (id, newStatus) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    if (id.includes('-') && id.length > 20) {
      try {
        const backendStatus = newStatus === 'Approved' ? 'ACTIVE' : 'REJECTED';
        await adminApi.updateStoreStatus(id, backendStatus);
      } catch (err) {
        console.warn('Backend store update failed:', err.message);
      }
    }
  };

  const pendingSellersCount = sellers.filter((s) => s.status.includes('Pending')).length;

  return (
    <div className="admin-layout">
      {/* Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand-header">
          <div className="brand-logo">🛒</div>
          <div>
            <div className="brand-title">Quick<span>Kart</span></div>
            <span className="brand-badge">Central Admin</span>
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <div className="nav-item-content">
                <span>📊</span> Analytics & Overview
              </div>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <div className="nav-item-content">
                <span>📦</span> Live Orders Monitor
              </div>
              <span className="nav-badge">{orders.length}</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'sellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('sellers')}
            >
              <div className="nav-item-content">
                <span>🏪</span> Seller Approvals
              </div>
              {pendingSellersCount > 0 && (
                <span className="nav-badge" style={{ background: '#EA580C' }}>{pendingSellersCount}</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'riders' ? 'active' : ''}`}
              onClick={() => setActiveTab('riders')}
            >
              <div className="nav-item-content">
                <span>🛵</span> Delivery Partner Fleet
              </div>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <div className="nav-item-content">
                <span>🏷️</span> Coupons & Offers
              </div>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="nav-item-content">
                <span>⚙️</span> Platform Settings
              </div>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div>QuickKart Portal v1.0</div>
          <div className="hub-status">
            <span>●</span> Central Hub
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <div className="topbar-search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="topbar-search"
                placeholder="Search Orders, Stores, Riders (Ctrl+K)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span className="status-dot"></span>
              All Systems Operational
            </div>

            <div className="admin-profile-pill">
              <div className="admin-avatar">👑</div>
              <div>
                <div className="admin-name">Admin Superuser</div>
                <div className="admin-role">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="admin-content">
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Platform Analytics & Overview</h1>
                  <p className="page-subtitle">Real-time health metrics, order volumes, and financial performance</p>
                </div>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Gross Merchandise Value</span>
                    <div className="kpi-icon-bubble green">💰</div>
                  </div>
                  <div className="kpi-value">{metrics.gmv}</div>
                  <span className="kpi-trend positive">↑ +18.4% this week</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Total Orders Today</span>
                    <div className="kpi-icon-bubble blue">📦</div>
                  </div>
                  <div className="kpi-value">{metrics.ordersToday}</div>
                  <span className="kpi-trend positive">✓ 98.2% on-time</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Active Local Stores</span>
                    <div className="kpi-icon-bubble orange">🏪</div>
                  </div>
                  <div className="kpi-value">{metrics.activeStores}</div>
                  <span className="kpi-trend warning">{pendingSellersCount} approvals pending</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Riders on Duty</span>
                    <div className="kpi-icon-bubble purple">🛵</div>
                  </div>
                  <div className="kpi-value">{metrics.ridersOnDuty}</div>
                  <span className="kpi-trend neutral">Avg ETA: 18.2 min</span>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="data-card">
                <div className="card-header-row">
                  <h3 className="card-title">Recent Live Orders</h3>
                  <button className="btn-sm btn-primary" onClick={() => setActiveTab('orders')}>
                    View Live Dispatch Fleet →
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Store</th>
                        <th>Amount</th>
                        <th>Rider Assigned</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 800, color: '#3B82F6' }}>{o.id}</td>
                          <td style={{ fontWeight: 600 }}>{o.customer}</td>
                          <td>{o.store}</td>
                          <td style={{ fontWeight: 800 }}>{o.amount}</td>
                          <td>{o.rider}</td>
                          <td>
                            <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'On The Way' ? 'badge-warning' : 'badge-info'}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ORDERS MONITOR */}
          {activeTab === 'orders' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Live Orders Fleet Dispatch</h1>
                  <p className="page-subtitle">Real-time status updates and order transitions across all hub stores</p>
                </div>
                <span className="badge badge-success">● Auto-Refresh: 10s</span>
              </div>

              <div className="data-card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Time</th>
                        <th>Customer Name</th>
                        <th>Store Name</th>
                        <th>Order Contents</th>
                        <th>Amount</th>
                        <th>Assigned Rider</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 800, color: '#3B82F6' }}>{o.id}</td>
                          <td style={{ color: '#64748B', fontSize: 12 }}>{o.time}</td>
                          <td style={{ fontWeight: 600 }}>{o.customer}</td>
                          <td>{o.store}</td>
                          <td style={{ fontSize: 12, color: '#475569' }}>{o.items}</td>
                          <td style={{ fontWeight: 800 }}>{o.amount}</td>
                          <td>{o.rider}</td>
                          <td>
                            <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'On The Way' ? 'badge-warning' : 'badge-info'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn-sm" onClick={() => alert(`Inspecting order ${o.id}`)}>
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SELLER APPROVALS */}
          {activeTab === 'sellers' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Merchant & Store Verification</h1>
                  <p className="page-subtitle">Verify FSSAI licenses, business registrations, and store locations</p>
                </div>
                {pendingSellersCount > 0 && (
                  <span className="badge badge-warning">{pendingSellersCount} Requests Pending</span>
                )}
              </div>

              <div className="data-card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Merchant ID</th>
                        <th>Store Name</th>
                        <th>Category</th>
                        <th>Owner Name</th>
                        <th>Contact</th>
                        <th>FSSAI License</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 800 }}>{s.id}</td>
                          <td style={{ fontWeight: 700 }}>{s.name}</td>
                          <td><span className="badge badge-info">{s.category}</span></td>
                          <td>{s.owner}</td>
                          <td>{s.phone}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.fssai}</td>
                          <td>
                            <span className={`badge ${s.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td>
                            {s.status.includes('Pending') ? (
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  className="btn-sm btn-success"
                                  onClick={() => handleVerifySeller(s.id, 'Approved')}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  className="btn-sm btn-danger"
                                  onClick={() => handleVerifySeller(s.id, 'Rejected')}
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 12 }}>
                                ✓ Verified Merchant
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY FLEET */}
          {activeTab === 'riders' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Delivery Partner Fleet</h1>
                  <p className="page-subtitle">Real-time driver roster, active duty shifts, and vehicle tracking</p>
                </div>
                <span className="badge badge-info">
                  {riders.filter((r) => !r.activeShift.includes('Offline')).length} Active on Shift
                </span>
              </div>

              <div className="data-card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rider ID</th>
                        <th>Rider Name</th>
                        <th>Vehicle & Reg</th>
                        <th>Operating Zone</th>
                        <th>Current Shift</th>
                        <th>Trips Today</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riders.map((r) => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 800 }}>{r.id}</td>
                          <td style={{ fontWeight: 700 }}>{r.name}</td>
                          <td>{r.vehicle}</td>
                          <td>{r.zone}</td>
                          <td>
                            <span className={`badge ${r.activeShift.includes('Online') ? 'badge-success' : r.activeShift.includes('On Delivery') ? 'badge-warning' : 'badge-danger'}`}>
                              {r.activeShift}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800 }}>{r.completed} trips</td>
                          <td>{r.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Promotions & Coupon Codes</h1>
                  <p className="page-subtitle">Manage customer acquisition campaigns and order discount rules</p>
                </div>
                <button
                  className="btn-sm btn-primary"
                  onClick={() => alert('New coupon creation modal')}
                >
                  + Create Coupon Code
                </button>
              </div>

              <div className="data-card">
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Coupon Code</th>
                        <th>Discount Value</th>
                        <th>Min Order Value</th>
                        <th>Times Redeemed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((c) => (
                        <tr key={c.code}>
                          <td style={{ fontWeight: 800, color: '#FF6B35', letterSpacing: 0.8 }}>{c.code}</td>
                          <td style={{ fontWeight: 700 }}>{c.discount}</td>
                          <td>{c.minOrder}</td>
                          <td style={{ fontWeight: 700 }}>{c.usedCount} customers</td>
                          <td>
                            <span className="badge badge-success">{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Platform Configuration</h1>
                  <p className="page-subtitle">Global delivery fees, marketplace commissions, and business rules</p>
                </div>
              </div>

              <div className="data-card" style={{ maxWidth: 640 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="form-group">
                    <label className="form-label">Platform Commission Rate (%)</label>
                    <input type="number" defaultValue="10" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Standard Base Delivery Radius (km)</label>
                    <input type="number" defaultValue="5" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Free Delivery Threshold (₹)</label>
                    <input type="number" defaultValue="499" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Surge Multiplier</label>
                    <input type="number" step="0.1" defaultValue="1.0" className="form-input" />
                  </div>

                  <button
                    className="btn-sm btn-primary"
                    style={{ alignSelf: 'flex-start', padding: '12px 24px', marginTop: 8 }}
                    onClick={() => alert('Platform rules saved successfully!')}
                  >
                    Save Platform Rules
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
