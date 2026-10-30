import React, { useState } from 'react';
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

  const handleVerifySeller = (id, newStatus) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="admin-layout">
      {/* Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand-header">
          <span className="brand-logo">🛒</span>
          <div>
            <div className="brand-title">QuickKart</div>
            <span className="brand-badge">Central Admin</span>
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span>📊</span> Analytics & Overview
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span>📦</span> Live Orders Monitor
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'sellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('sellers')}
            >
              <span>🏪</span> Seller Approvals ({sellers.filter((s) => s.status.includes('Pending')).length})
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'riders' ? 'active' : ''}`}
              onClick={() => setActiveTab('riders')}
            >
              <span>🛵</span> Delivery Partner Fleet
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <span>🏷️</span> Coupons & Offers
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span>⚙️</span> Platform Settings
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <span>QuickKart Portal v1.0</span>
          <span>Bhopal Hub</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <input
              type="text"
              className="topbar-search"
              placeholder="Search Orders, Stores, Riders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <span>●</span> All Systems Operational
            </div>

            <div className="admin-profile-pill">
              <div className="admin-avatar">👑</div>
              <span>Admin Superuser</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="admin-content">
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Gross Merchandise Value (GMV)</span>
                    <span className="kpi-icon">💰</span>
                  </div>
                  <div className="kpi-value">₹2,48,920</div>
                  <div className="kpi-sub">+18.4% this week</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Total Orders Today</span>
                    <span className="kpi-icon">📦</span>
                  </div>
                  <div className="kpi-value">1,428</div>
                  <div className="kpi-sub">98.2% on-time delivery</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Active Local Stores</span>
                    <span className="kpi-icon">🏪</span>
                  </div>
                  <div className="kpi-value">142</div>
                  <div className="kpi-sub" style={{ color: '#D97706' }}>
                    {sellers.filter((s) => s.status.includes('Pending')).length} pending approvals
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <span className="kpi-title">Riders on Duty</span>
                    <span className="kpi-icon">🛵</span>
                  </div>
                  <div className="kpi-value">68</div>
                  <div className="kpi-sub">Avg delivery: 18.2 mins</div>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="data-card">
                <div className="card-header-row">
                  <h3 className="card-title">Recent Live Orders</h3>
                  <button className="btn-sm btn-primary" onClick={() => setActiveTab('orders')}>
                    View All Orders →
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
                          <td style={{ fontWeight: 700 }}>{o.id}</td>
                          <td>{o.customer}</td>
                          <td>{o.store}</td>
                          <td style={{ fontWeight: 700 }}>{o.amount}</td>
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
            <div className="data-card">
              <div className="card-header-row">
                <h3 className="card-title">Live Orders Fleet Dispatch</h3>
                <span className="badge badge-success">Auto-Refresh: Every 10s</span>
              </div>
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
                        <td style={{ fontWeight: 800 }}>{o.id}</td>
                        <td style={{ color: '#64748B' }}>{o.time}</td>
                        <td>{o.customer}</td>
                        <td>{o.store}</td>
                        <td style={{ fontSize: 12 }}>{o.items}</td>
                        <td style={{ fontWeight: 800 }}>{o.amount}</td>
                        <td>{o.rider}</td>
                        <td>
                          <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'On The Way' ? 'badge-warning' : 'badge-info'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-sm" onClick={() => alert(`Order details for ${o.id}`)}>
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SELLER APPROVALS */}
          {activeTab === 'sellers' && (
            <div className="data-card">
              <div className="card-header-row">
                <h3 className="card-title">Merchant & Store Verification Requests</h3>
                <span style={{ fontSize: 13, color: '#64748B' }}>Verify FSSAI, GST & Store Location</span>
              </div>
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
                        <td style={{ fontWeight: 700 }}>{s.id}</td>
                        <td style={{ fontWeight: 700 }}>{s.name}</td>
                        <td>{s.category}</td>
                        <td>{s.owner}</td>
                        <td>{s.phone}</td>
                        <td style={{ fontFamily: 'monospace' }}>{s.fssai}</td>
                        <td>
                          <span className={`badge ${s.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          {s.status.includes('Pending') ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="btn-sm btn-success"
                                onClick={() => handleVerifySeller(s.id, 'Approved')}
                              >
                                Approve ✅
                              </button>
                              <button
                                className="btn-sm btn-danger"
                                onClick={() => handleVerifySeller(s.id, 'Rejected')}
                              >
                                Reject ❌
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#16A34A', fontWeight: 600, fontSize: 12 }}>
                              Active Merchant
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY FLEET */}
          {activeTab === 'riders' && (
            <div className="data-card">
              <div className="card-header-row">
                <h3 className="card-title">Delivery Partner Fleet Roster</h3>
                <span className="badge badge-info">{riders.filter((r) => !r.activeShift.includes('Offline')).length} Active on Shift</span>
              </div>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Rider ID</th>
                      <th>Rider Name</th>
                      <th>Vehicle & Registration</th>
                      <th>Operating Zone</th>
                      <th>Current Shift</th>
                      <th>Today Completed</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riders.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700 }}>{r.id}</td>
                        <td style={{ fontWeight: 700 }}>{r.name}</td>
                        <td>{r.vehicle}</td>
                        <td>{r.zone}</td>
                        <td>
                          <span className={`badge ${r.activeShift.includes('Online') ? 'badge-success' : r.activeShift.includes('On Delivery') ? 'badge-warning' : 'badge-danger'}`}>
                            {r.activeShift}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700 }}>{r.completed} trips</td>
                        <td>{r.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="data-card">
              <div className="card-header-row">
                <h3 className="card-title">Promotions & Coupon Codes</h3>
                <button
                  className="btn-sm btn-primary"
                  onClick={() => alert('New coupon creation modal')}
                >
                  + Create Coupon Code
                </button>
              </div>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Coupon Code</th>
                      <th>Discount Value</th>
                      <th>Min Order Value</th>
                      <th>Total Times Redeemed</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.code}>
                        <td style={{ fontWeight: 800, color: '#3B82F6', letterSpacing: 1 }}>{c.code}</td>
                        <td style={{ fontWeight: 700 }}>{c.discount}</td>
                        <td>{c.minOrder}</td>
                        <td>{c.usedCount} customers</td>
                        <td>
                          <span className="badge badge-success">{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="data-card" style={{ maxWidth: 650 }}>
              <h3 className="card-title" style={{ marginBottom: 16 }}>Platform Configuration</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Platform Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Standard Base Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Free Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue="199"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: 6 }}
                  />
                </div>

                <button
                  className="btn-sm btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', marginTop: 10 }}
                  onClick={() => alert('Platform settings saved successfully!')}
                >
                  Save Platform Rules
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
