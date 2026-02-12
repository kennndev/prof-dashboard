import React, { useState, useEffect } from 'react';
import { fetchOrders, fetchAllOrders, fetchOrderById } from '../services/orderService';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import Customers from './Customers';
import Analytics from './Analytics';
import CardBatcherPro, { BatcherPROSidebar } from './BatcherPRO';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAll, setLoadingAll] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('orders');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        loadOrders();
    }, [page, searchTerm]);

    useEffect(() => {
        if (activeView === 'customers' || activeView === 'analytics') {
            if (allOrders.length === 0 && !loadingAll) {
                loadAllOrders();
            }
        }
    }, [activeView]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const { data, count } = await fetchOrders(page, pageSize, searchTerm);
            setOrders(data);
            setTotalCount(count);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAllOrders = async () => {
        setLoadingAll(true);
        try {
            const data = await fetchAllOrders();
            setAllOrders(data);
        } catch (error) {
            console.error('Failed to load all orders', error);
        } finally {
            setLoadingAll(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleSelectOrder = async (order) => {
        try {
            // Fetch full order details including card_images and card_data
            const fullOrder = await fetchOrderById(order.id);
            setSelectedOrder(fullOrder);
        } catch (error) {
            console.error('Failed to load order details:', error);
            // Fallback to the order from the list if fetch fails
            setSelectedOrder(order);
        }
    };

    return (
        <div className="dashboard-container">
            {activeView === 'batcher' ? (
                <CardBatcherPro showSidebar={false} onBackToDashboard={() => setActiveView('orders')} />
            ) : (
                <>
                    <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <div className="logo">
                            <img src="/logo.png" alt="TCGPlaytest Logo" style={{ width: '32px', height: '32px' }} />
                            TCGPlaytest
                        </div>

                        <nav>
                            <div className="nav-section-title" style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '0.5rem',
                                paddingLeft: '1rem'
                            }}>
                                Menu
                            </div>
                            <div
                                className={`nav-item ${activeView === 'orders' ? 'active' : ''}`}
                                onClick={() => { setActiveView('orders'); setMobileMenuOpen(false); }}
                            >
                                <span>📦</span> Orders
                            </div>
                            <div
                                className={`nav-item ${activeView === 'customers' ? 'active' : ''}`}
                                onClick={() => { setActiveView('customers'); setMobileMenuOpen(false); }}
                            >
                                <span>👥</span> Customers
                            </div>
                            <div
                                className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
                                onClick={() => { setActiveView('analytics'); setMobileMenuOpen(false); }}
                            >
                                <span>📊</span> Analytics
                            </div>

                            <div className="nav-section-title" style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '0.5rem',
                                marginTop: '1.5rem',
                                paddingLeft: '1rem'
                            }}>
                                Apps
                            </div>
                            <div
                                className={`nav-item ${activeView === 'batcher' ? 'active' : ''}`}
                                onClick={() => { setActiveView('batcher'); setMobileMenuOpen(false); }}
                            >
                                <span>🎴</span> Batcher PRO
                            </div>
                        </nav>
                    </aside>

                    {mobileMenuOpen && (
                        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
                    )}

                    <main className="main-content">
                        <header className="header">
                            <button
                                className="mobile-menu-btn"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                ☰
                            </button>
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="user-profile">
                                <div className="avatar">Admin</div>
                            </div>
                        </header>

                        <div className="content-area">
                            {loading ? (
                                <div className="loading">Loading orders...</div>
                            ) : (
                                <>
                                    {activeView === 'orders' && (
                                        <>
                                            <h1 className="page-title">Orders</h1>
                                            <OrderList
                                                orders={orders}
                                                onSelectOrder={handleSelectOrder}
                                                page={page}
                                                setPage={setPage}
                                                totalCount={totalCount}
                                                pageSize={pageSize}
                                            />
                                        </>
                                    )}

                                    {activeView === 'customers' && (
                                        loadingAll ? (
                                            <div className="loading">Loading customer data...</div>
                                        ) : (
                                            <Customers orders={allOrders} />
                                        )
                                    )}

                                    {activeView === 'analytics' && (
                                        loadingAll ? (
                                            <div className="loading">Loading analytics data...</div>
                                        ) : (
                                            <Analytics orders={allOrders} />
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </main>

                    {selectedOrder && (
                        <OrderDetail
                            order={selectedOrder}
                            onClose={() => setSelectedOrder(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
