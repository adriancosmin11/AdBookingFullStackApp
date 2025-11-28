import { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Typography, Box, Alert, CircularProgress 
} from '@mui/material';
import { AdSpace, BookingRequest } from '../types/index';
import { useAdStore } from '../store/useAdStore.tsx';

interface Props {
    open: boolean;
    onClose: () => void;
    adSpace: AdSpace | null;
}

export const BookingModal = ({ open, onClose, adSpace }: Props) => {
    const { createBooking, isLoading } = useAdStore();
    
    const [formData, setFormData] = useState({
        advertiserName: '',
        advertiserEmail: '',
        startDate: '',
        endDate: ''
    });
    
    const [totalCost, setTotalCost] = useState(0);
    // Erori venite de la backend
    const [serverError, setServerError] = useState<string | null>(null);
    // Erori de validare locală (Frontend)
    const [validationError, setValidationError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 1. VALIDARE ÎN TIMP REAL
    useEffect(() => {
        setValidationError(null); // Resetăm eroarea
        setTotalCost(0);

        if (!formData.startDate || !formData.endDate) return;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorăm ora curentă, ne interesează doar ziua

        // Regula 1: Data de start trebuie să fie în viitor
        if (start <= today) {
            setValidationError("Start date must be in the future (from tomorrow onwards).");
            return;
        }

        // Regula 2: Data de final după data de start
        if (end <= start) {
            setValidationError("End date must be after start date.");
            return;
        }

        // Regula 3: Durata minimă 7 zile
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays < 7) {
            setValidationError(`Minimum booking duration is 7 days. (Current: ${diffDays} days)`);
            return;
        }

        // Dacă totul e ok, calculăm prețul
        if (adSpace) {
            setTotalCost(diffDays * adSpace.pricePerDay);
        }

    }, [formData.startDate, formData.endDate, adSpace]);

    const handleSubmit = async () => {
        if (!adSpace || validationError) return;
        setServerError(null);

        const request: BookingRequest = {
            adSpace: { id: adSpace.id },
            advertiserName: formData.advertiserName,
            advertiserEmail: formData.advertiserEmail,
            startDate: formData.startDate,
            endDate: formData.endDate
        };

        try {
            await createBooking(request);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData({ advertiserName: '', advertiserEmail: '', startDate: '', endDate: '' });
                onClose();
            }, 2000);
        } catch (err: any) {
            setServerError(err.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Book {adSpace?.name}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {success && <Alert severity="success">Booking created successfully!</Alert>}
                    
                    {/* Afișăm erorile de server (roșu închis) */}
                    {serverError && <Alert severity="error">Server Error: {serverError}</Alert>}
                    
                    {/* Afișăm erorile de validare (portocaliu/warning sau roșu) */}
                    {validationError && <Alert severity="warning">{validationError}</Alert>}

                    <TextField
                        label="Advertiser Name"
                        fullWidth
                        value={formData.advertiserName}
                        onChange={(e) => setFormData({...formData, advertiserName: e.target.value})}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.advertiserEmail}
                        onChange={(e) => setFormData({...formData, advertiserEmail: e.target.value})}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.startDate}
                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            error={!!validationError && validationError.includes("Start date")}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.endDate}
                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            error={!!validationError && (validationError.includes("End date") || validationError.includes("days"))}
                        />
                    </Box>

                    {totalCost > 0 && !validationError && (
                        <Typography variant="h6" align="right" color="primary">
                            Total Cost: ${totalCost.toFixed(2)}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    // Dezactivăm butonul dacă avem eroare de validare sau date lipsă
                    disabled={isLoading || !!validationError || !formData.startDate || !formData.endDate}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Confirm Booking'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};