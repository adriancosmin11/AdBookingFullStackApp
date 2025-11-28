import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid'; 
import { 
    Container, Card, CardContent, Typography, Button, 
    FormControl, InputLabel, Select, MenuItem, Box, Chip 
} from '@mui/material';
import { useAdStore } from '../store/useAdStore.tsx';
import { AdSpaceType, AdSpace } from '../types/index.ts';
import { BookingModal } from './BookingModal.tsx'; 

export const AdSpaceList = () => {
    const { adSpaces, fetchAdSpaces } = useAdStore();
    const [selectedType, setSelectedType] = useState<string>('');
    
    // State pentru Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState<AdSpace | null>(null);

    useEffect(() => {
        const typeParam = selectedType ? (selectedType as AdSpaceType) : undefined;
        fetchAdSpaces(typeParam);
    }, [selectedType, fetchAdSpaces]);

    // Funcția care se apelează când dai click pe "Book Now"
    const handleBookClick = (space: AdSpace) => {
        setSelectedSpace(space); // Ținem minte ce panou am ales
        setIsModalOpen(true);    // Deschidem fereastra
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Type</InputLabel>
                    <Select
                        value={selectedType}
                        label="Filter by Type"
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <MenuItem value=""><em>All Types</em></MenuItem>
                        {Object.values(AdSpaceType).map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {adSpaces.map((space) => (
                    <Grid item xs={12} md={4} key={space.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {space.name}
                                </Typography>
                                <Chip 
                                    label={space.status} 
                                    color={space.status === 'AVAILABLE' ? 'success' : 'default'} 
                                    size="small" 
                                    sx={{ mb: 2 }}
                                />
                                <Typography color="text.secondary">Type: {space.type}</Typography>
                                <Typography color="text.secondary">Location: {space.location}</Typography>
                                <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                    ${space.pricePerDay} / day
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, mt: 'auto' }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    disabled={space.status !== 'AVAILABLE'}
                                    onClick={() => handleBookClick(space)} // <--- Aici s-a schimbat
                                >
                                    {space.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Aici punem Modalul, invizibil până când isModalOpen devine true */}
            <BookingModal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                adSpace={selectedSpace}
            />
        </Container>
    );
};