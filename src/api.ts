/// <reference types="vite/client" />

/**
 * API Service Layer
 * Handles all communication between the React frontend and PHP backend
 * Includes automatic token management, refresh, and error handling
 */

// ─── Configuration ───
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost/web1backend/api';

// ─── Token Management ───
class TokenManager {
    static getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    static clearTokens(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('admin_token'); // Legacy cleanup
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }
}

// ─── API Client ───
class ApiClient {
    private static isRefreshing = false;
    private static refreshPromise: Promise<boolean> | null = null;

    /**
     * Make an authenticated API request
     */
    static async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        // Add auth token if available
        const token = TokenManager.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle 401 - try to refresh token
            if (response.status === 401 && TokenManager.getRefreshToken()) {
                const refreshed = await this.tryRefreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
                    const retryResponse = await fetch(url, { ...options, headers });

                    if (!retryResponse.ok) {
                        const errorData = await retryResponse.json().catch(() => ({}));
                        throw new ApiError(
                            errorData.message || `Request failed with status ${retryResponse.status}`,
                            retryResponse.status,
                            errorData.errors
                        );
                    }

                    return await retryResponse.json();
                } else {
                    // Refresh failed - logout
                    TokenManager.clearTokens();
                    window.location.href = '/login';
                    throw new ApiError('Session expired. Please login again.', 401);
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || `Request failed with status ${response.status}`,
                    response.status,
                    errorData.errors
                );
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();

        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Network error. Please check your connection.', 0);
        }
    }

    /**
     * Try to refresh the access token
     */
    private static async tryRefreshToken(): Promise<boolean> {
        // Prevent multiple simultaneous refresh attempts
        if (this.isRefreshing) {
            return this.refreshPromise!;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.doRefreshToken();

        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    private static async doRefreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: TokenManager.getRefreshToken() }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data?.access_token) {
                    localStorage.setItem('access_token', data.data.access_token);
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }
}

// ─── Error Class ───
class ApiError extends Error {
    status: number;
    errors: any;

    constructor(message: string, status: number, errors?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

// ─── API Types ───
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: {
        id: number;
        username: string;
        role: string;
    };
}

interface MenuPdf {
    id: number;
    title: string;
    filename: string;
    original_name: string;
    file_url: string;
    file_size: number;
    is_active: number;
    uploaded_at: string;
}

interface GalleryImage {
    id: number;
    url: string;
    alt: string;
    title: string;
    sort_order?: number;
}

interface Reservation {
    id: number;
    name: string;
    email: string;
    date: string;
    guests: string;
    requirements: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
}

interface SettingsData {
    address: string;
    phone: string;
    email: string;
    hours_mon_thu: string;
    hours_fri_sat: string;
    hours_sun: string;
    [key: string]: string;
}

// ─── API Functions ───

// Auth
export const authApi = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await ApiClient.request<ApiResponse<LoginResponse>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        // Store tokens
        if (response.data) {
            TokenManager.setTokens(response.data.access_token, response.data.refresh_token);
        }

        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await ApiClient.request('/auth/logout', { method: 'POST' });
        } finally {
            TokenManager.clearTokens();
        }
    },

    getMe: async () => {
        return (await ApiClient.request<ApiResponse<any>>('/auth/me')).data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await ApiClient.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
    },

    refreshToken: async (): Promise<boolean> => {
        try {
            const refreshToken = TokenManager.getRefreshToken();
            if (!refreshToken) return false;

            const response = await ApiClient.request<ApiResponse<{ access_token: string }>>('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.data?.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    },
};

// Menu PDF
export const menuPdfApi = {
    getAll: async (): Promise<MenuPdf[]> => {
        const response = await ApiClient.request<ApiResponse<MenuPdf[]>>('/menu');
        return response.data;
    },

    getActivePdfUrl: async (): Promise<string | null> => {
        const pdfs = await menuPdfApi.getAll();
        const active = pdfs.find(p => p.is_active === 1);
        return active ? active.file_url : null;
    },

    upload: async (file: File, title?: string, setActive: boolean = true): Promise<MenuPdf> => {
        const formData = new FormData();
        formData.append('pdf', file);
        if (title) formData.append('title', title);
        formData.append('set_active', setActive ? '1' : '0');

        const token = TokenManager.getAccessToken();
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.message || 'PDF upload failed', response.status);
        }

        const result = await response.json();
        return result.data;
    },

    setActive: async (id: number): Promise<void> => {
        await ApiClient.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ is_active: true }),
        });
    },

    updateTitle: async (id: number, title: string): Promise<void> => {
        await ApiClient.request(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title }),
        });
    },

    delete: async (id: number): Promise<void> => {
        await ApiClient.request(`/menu/${id}`, { method: 'DELETE' });
    },

    getDownloadUrl: (): string => {
        return `${API_BASE_URL}/menu/download`;
    },
};

// Gallery
export const galleryApi = {
    getAll: async (): Promise<GalleryImage[]> => {
        const response = await ApiClient.request<ApiResponse<GalleryImage[]>>('/gallery');
        return response.data;
    },

    create: async (data: { url: string; alt?: string; title?: string }): Promise<{ id: number }> => {
        const response = await ApiClient.request<ApiResponse<{ id: number }>>('/gallery', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    upload: async (file: File, alt?: string, title?: string): Promise<{ id: number; url: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        if (alt) formData.append('alt', alt);
        if (title) formData.append('title', title);

        const token = TokenManager.getAccessToken();
        const response = await fetch(`${API_BASE_URL}/gallery`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.message || 'Upload failed', response.status);
        }

        const result = await response.json();
        return result.data;
    },

    delete: async (id: number): Promise<void> => {
        await ApiClient.request(`/gallery/${id}`, { method: 'DELETE' });
    },
};

// Reservations
export const reservationsApi = {
    getAll: async (params?: { status?: string; date?: string; page?: number; per_page?: number }): Promise<PaginatedResponse<Reservation>> => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.set('status', params.status);
        if (params?.date) searchParams.set('date', params.date);
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.per_page) searchParams.set('per_page', String(params.per_page));

        const queryString = searchParams.toString();
        const url = `/reservations${queryString ? '?' + queryString : ''}`;

        return await ApiClient.request<PaginatedResponse<Reservation>>(url);
    },

    create: async (data: {
        name: string;
        email: string;
        date: string;
        guests: string;
        requirements?: string;
    }): Promise<{ id: number }> => {
        const response = await ApiClient.request<ApiResponse<{ id: number }>>('/reservations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    updateStatus: async (id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> => {
        await ApiClient.request(`/reservations/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    delete: async (id: number): Promise<void> => {
        await ApiClient.request(`/reservations/${id}`, { method: 'DELETE' });
    },
};

// Settings
export const settingsApi = {
    getAll: async (): Promise<SettingsData> => {
        const response = await ApiClient.request<ApiResponse<SettingsData>>('/settings');
        return response.data;
    },

    update: async (data: Partial<SettingsData>): Promise<void> => {
        await ApiClient.request('/settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// Contacts
export const contactApi = {
    create: async (data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<{ id: number }> => {
        const response = await ApiClient.request<ApiResponse<{ id: number }>>('/contacts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    getAll: async (page: number = 1, perPage: number = 20, status?: string): Promise<any> => {
        let endpoint = `/contacts?page=${page}&per_page=${perPage}`;
        if (status) endpoint += `&status=${status}`;
        const response = await ApiClient.request<any>(endpoint);
        return response;
    },

    get: async (id: number): Promise<Contact> => {
        const response = await ApiClient.request<ApiResponse<Contact>>(`/contacts?id=${id}`);
        return response.data;
    },

    updateStatus: async (id: number, status: 'new' | 'read' | 'replied'): Promise<void> => {
        await ApiClient.request(`/contacts?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    delete: async (id: number): Promise<void> => {
        await ApiClient.request(`/contacts?id=${id}`, { method: 'DELETE' });
    },
};

// Health Check
export const healthApi = {
    check: async (): Promise<any> => {
        const response = await ApiClient.request<ApiResponse<any>>('/health');
        return response.data;
    },
};

// Export TokenManager for auth state management
export { TokenManager, ApiError };
export type { MenuPdf, GalleryImage, Reservation, Contact, SettingsData, ApiResponse, PaginatedResponse };
