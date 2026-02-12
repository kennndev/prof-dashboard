import React from 'react';

const Analytics = ({ orders }) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount_cents, 0);
    const totalCards = orders.reduce((sum, order) => sum + order.quantity, 0);

    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const formatCurrency = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(cents / 100);
    };

    return (
        <div>
            <h1 className="page-title">Analytics</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-value">{totalOrders}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total Cards Printed</div>
                    <div className="stat-value">{totalCards}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Average Order Value</div>
                    <div className="stat-value">{formatCurrency(avgOrderValue)}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Paid Orders</div>
                    <div className="stat-value status-paid">{paidOrders}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Pending Orders</div>
                    <div className="stat-value status-pending">{pendingOrders}</div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
