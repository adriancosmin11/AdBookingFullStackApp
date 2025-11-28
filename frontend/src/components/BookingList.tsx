import React, { useEffect } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Chip, Typography, Container, Box 
} from '@mui/material';
import { useAdStore } from '../store/useAdStore.tsx';

export const BookingList = () => {
    const { bookings, fetchBookings, updateBookingStatus, isLoading } = useAdStore();

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            default: return 'warning'; // PENDING
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Booking Requests (Admin)
            </Typography>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Ad Space</TableCell>
                            <TableCell>Advertiser</TableCell>
                            <TableCell>Dates</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>#{booking.id}</TableCell>
                                <TableCell>
                                    {/* Accesăm numele spațiului din obiectul adSpace */}
                                    {(booking.adSpace as any)?.name || 'Unknown Space'}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{booking.advertiserName}</Typography>
                                    <Typography variant="caption" color="textSecondary">{booking.advertiserEmail}</Typography>
                                </TableCell>
                                <TableCell>
                                    {booking.startDate} <br/> to <br/> {booking.endDate}
                                </TableCell>
                                <TableCell>${booking.totalCost}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={booking.status} 
                                        color={getStatusColor(booking.status)} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {booking.status === 'PENDING' && (
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                size="small"
                                                disabled={isLoading}
                                                onClick={() => booking.id && updateBookingStatus(booking.id, 'APPROVED')}
                                            >
                                                Approve
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                size="small"
                                                disabled={isLoading}
                                                onClick={() => booking.id && updateBookingStatus(booking.id, 'REJECTED')}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {bookings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No bookings found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};