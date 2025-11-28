import { create } from 'zustand';
import axiosClient from '../api/axiosClient.ts';
import { AdSpace, AdSpaceType, BookingRequest } from '../types/index';

interface AdStoreState {
    adSpaces: AdSpace[];
    bookings: BookingRequest[]; // <--- LISTA NOUĂ
    isLoading: boolean;
    error: string | null;
    
    fetchAdSpaces: (type?: AdSpaceType, city?: string) => Promise<void>;
    createBooking: (booking: BookingRequest) => Promise<void>;
    
    // ACȚIUNI NOI PENTRU ADMIN
    fetchBookings: () => Promise<void>;
    updateBookingStatus: (id: number, status: 'APPROVED' | 'REJECTED') => Promise<void>;
}

export const useAdStore = create<AdStoreState>((set, get) => ({
    adSpaces: [],
    bookings: [], // <--- Inițializare
    isLoading: false,
    error: null,

    fetchAdSpaces: async (type, city) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (city) params.append('city', city);
            const response = await axiosClient.get(`/ad-spaces?${params.toString()}`);
            set({ adSpaces: response.data, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ error: 'Failed to fetch ad spaces', isLoading: false });
        }
    },

    createBooking: async (booking) => {
        set({ isLoading: true, error: null });
        try {
            await axiosClient.post('/booking-requests', booking);
            set({ isLoading: false });
        } catch (err: any) {
            console.error(err);
            const message = err.response?.data?.error || 'Failed to create booking';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    // --- LOGICA NOUĂ DE ADMIN ---

    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosClient.get('/booking-requests');
            set({ bookings: response.data, isLoading: false });
        } catch (err) {
            console.error(err);
            set({ error: 'Failed to fetch bookings', isLoading: false });
        }
    },

    updateBookingStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
            // Trimitem cererea la backend (approve sau reject)
            const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
            await axiosClient.patch(`/booking-requests/${id}/${endpoint}`);
            
            // Reîmprospătăm lista după modificare
            await get().fetchBookings(); 
            // Opțional: Reîmprospătăm și spațiile (poate unele au devenit indisponibile)
            get().fetchAdSpaces();
            
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to update status';
            set({ error: message, isLoading: false });
            alert(message); // Afișăm eroarea adminului
        }
    }
}));