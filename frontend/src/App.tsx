import { useState } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, Button, Box } from '@mui/material';
import { AdSpaceList } from './components/AdSpaceList.tsx';
import { BookingList } from './components/BookingList.tsx';

function App() {
  // Simplu sistem de "pagini"
  const [view, setView] = useState<'USER' | 'ADMIN'>('USER');

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Generatik Ad Booking
          </Typography>
          
          <Box>
            <Button 
                color="inherit" 
                onClick={() => setView('USER')}
                sx={{ fontWeight: view === 'USER' ? 'bold' : 'normal', borderBottom: view === 'USER' ? '2px solid white' : 'none' }}
            >
                Browse Spaces
            </Button>
            <Button 
                color="inherit" 
                onClick={() => setView('ADMIN')}
                sx={{ fontWeight: view === 'ADMIN' ? 'bold' : 'normal', borderBottom: view === 'ADMIN' ? '2px solid white' : 'none' }}
            >
                Admin Panel
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <main>
        {view === 'USER' ? <AdSpaceList /> : <BookingList />}
      </main>
    </>
  );
}

export default App;