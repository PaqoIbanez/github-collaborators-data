import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { UserProps } from '../interfaces';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gitgubApi } from './Home';

export const UserInfo = () => {

   const { id } = useParams();
   console.log(id);


   const [user, setUser] = useState<UserProps>({
      id: '',
      login: '',
      avatar_url: '',
      name: ''
   })


   useEffect(() => {
      const fetchData = async () => {
         const { data } = await gitgubApi.get(`/users/${id}`);
         setUser(data);
      }

      // call the function
      fetchData()
         // make sure to catch any error
         .catch(console.error);;
   }, [])

   if (user.id === '') return <>CARGANGO...</>;
   return (
      <Box display='flex' height='calc(100vh - 200px)' justifyContent='center' alignItems='center'>
         <Card elevation={1} sx={{ margin: '5px', width: '600px' }}>
            <CardMedia
               component="img"
               image={user.avatar_url}
               alt="green iguana"
            />
            <CardContent sx={{ mb: 0 }}>
               <Typography variant="caption" component="div">
                  {user.name} - {user.login}
               </Typography>
               <Typography variant="caption" color="text.secondary">
                  {
                     user.location && `${user.location.substring(0, 100)}`
                  }
                  {
                     user.bio && user.bio.length > 150 ? '...' : ''
                  }
               </Typography>
               <Typography variant="caption" color="text.secondary">
                  {
                     user.email
                  }
                  {
                     user.bio && user.bio.length > 150 ? '...' : ''
                  }
               </Typography>
            </CardContent>
         </Card>
      </Box>
   )
}