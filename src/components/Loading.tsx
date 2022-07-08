import { Box, CircularProgress, Typography } from '@mui/material';

export const Loading = () => {
   return (
      <Box
         display='flex'
         flexDirection='column'
         justifyContent='center'
         alignItems='center'
         height='calc(100vh)'
         sx={{backgroundColor: 'rgba(0,0,0,0.7)'}}
      >
         <CircularProgress size='100px' sx={{mb: '20px', color: '#bbb'}} />
         <Typography variant='h5' color='white'>Loading...</Typography>
      </Box>
   )
}