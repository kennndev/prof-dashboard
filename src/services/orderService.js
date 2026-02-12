import { supabase } from './supabaseClient';

/**
 * Fetches all orders from the 'orders' table.
 * Used for Analytics and Customers views where full dataset is needed.
 * @returns {Promise<Array>} List of orders
 */
export const fetchAllOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
    return data;
};

/**
 * Fetches paid orders with only the fields BatchPro needs.
 * This is much faster than fetching all orders then filtering client-side.
 * @returns {Promise<Array>} Paid orders with card_images
 */
export const fetchPaidOrdersForBatcher = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, status, created_at, card_images, card_data')
        .in('status', ['paid', 'PAID'])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching paid orders:', error);
        throw error;
    }
    return data || [];
};

/**
 * Fetches paginated orders with optional search.
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<{data: Array, count: number}>} List of orders and total count
 */
export const fetchOrders = async (page = 1, pageSize = 20, searchTerm = '') => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('orders')
        .select('id, customer_name, customer_email, created_at, status, total_amount_cents, quantity, shipping_address', { count: 'exact' });

    if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching paginated orders:', error);
        throw error;
    }
    return { data, count };
};

/**
 * Fetches a single order by ID with all details including card_images and card_data.
 * @param {string} orderId - The order ID
 * @returns {Promise<object>} Full order object with all fields
 */
export const fetchOrderById = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
    return data;
};

/**
 * Generates a public URL for an image in the 'order-images' bucket.
 * @param {string} path - The path of the image in the bucket
 * @returns {string} Public URL
 */
export const getOrderImageUrl = (path) => {
    if (!path) return null;
    const trimmed = String(path).trim();

    // If it's already a URL/data/blob, return it as-is
    if (trimmed.startsWith('http')) return trimmed;
    if (trimmed.startsWith('data:')) return trimmed;
    if (trimmed.startsWith('blob:')) return trimmed;

    // Some rows store raw base64 without a data: prefix.
    // Detect and convert to a data URL so <img> can load it.
    // (Avoid treating normal storage paths like "folder/file.png" as base64.)
    const looksLikeRawBase64 =
        trimmed.length > 256 &&
        !trimmed.includes('/') &&
        !trimmed.includes('.') &&
        /^[A-Za-z0-9+/_-]+={0,2}$/.test(trimmed);

    if (looksLikeRawBase64) {
        // Normalize URL-safe base64 to standard base64 (+ / with padding)
        let b64 = trimmed.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        const pad = b64.length % 4;
        if (pad) b64 += '='.repeat(4 - pad);

        // Best-effort mime sniffing by common signatures
        let mime = 'image/png';
        if (b64.startsWith('/9j/')) mime = 'image/jpeg';
        else if (b64.startsWith('iVBOR')) mime = 'image/png';
        else if (b64.startsWith('R0lGOD')) mime = 'image/gif';
        else if (b64.startsWith('UklGR')) mime = 'image/webp';

        return `data:${mime};base64,${b64}`;
    }

    const { data } = supabase.storage
        .from('order-images')
        .getPublicUrl(trimmed);

    return data.publicUrl;
};

/**
 * Parses the shipping address JSON if it's a string, or returns it as is.
 * @param {string|object} address 
 * @returns {object}
 */
export const parseAddress = (address) => {
    if (!address) return {};
    if (typeof address === 'object') return address;
    try {
        // Handle double stringified JSON which sometimes happens
        let parsed = JSON.parse(address);
        if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
        }
        return parsed;
    } catch (e) {
        console.error('Error parsing address:', e);
        return {};
    }
};