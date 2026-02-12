import React from 'react';

const OrderList = ({ orders, onSelectOrder, page, setPage, totalCount, pageSize }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(cents / 100);
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="data-table-container">
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <span>Total Orders: {totalCount}</span>
                <div className="pagination-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        style={{ padding: '5px 10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages || 1}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        style={{ padding: '5px 10px', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Next
                    </button>
                </div>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} onClick={() => onSelectOrder(order)}>
                            <td>#{order.id.slice(0, 8)}</td>
                            <td>
                                <div style={{ fontWeight: 'bold' }}>{order.customer_name || 'Guest'}</div>
                                <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>
                                <span className={`status-badge status-${order.status}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>{formatCurrency(order.total_amount_cents)}</td>
                            <td>{order.quantity} cards</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
