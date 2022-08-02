import { useContext, useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Table } from './Table';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { Loading } from './components/Loading';
import { UIContext } from './context/ui/UIContext';
import UserModal from './components/UserModal';
import { gitgubApi } from './api/api';

const Home = () => {

   const { isLoading, setIsLoading } = useContext(UIContext);
   const [repository, setRepository] = useState('');
   const [error, setError] = useState(false);
   const [open, setOpen] = useState(false);
   const [owner, setOwner] = useState('');
   const [id, setId] = useState('');

   let contributors: any[] = [];

   let i = 1;

   const [users, setUsers] = useState([{
      avatar_url: "",
      bio: "",
      email: "",
      location: "",
      login: "",
      name: ""
   }]);

   const handleUserInfo = (idFromCard: string) => {
      setOpen(true);
      setId(idFromCard);
   }

   const getContributors = async () => {
      setIsLoading(true);
      try {
         const { data } = await gitgubApi.get<any[]>(
            `/repos/${owner}/${repository}/contributors?page=${i}&per_page=100`, {
            'headers': {
               'Authorization': `token ${import.meta.env.VITE_ACCESS_TOKEN}`,
               'Accept': 'application/vnd.github.v3+json',
            }
         }
         );

         if (data.length > 0) {
            data.map(cont => contributors.push(cont))
            i++;
            getContributors();
         } else {
            getContributorsInfo(contributors);
         }

      } catch (error) {
         setIsLoading(false);
         setError(true);
      }
   }

   const getContributorsInfo = async (contributorss: any[]) => {
      if (owner === '' || repository === '') return;
      setUsers([]);
      setError(false);
      try {
         setError(false);
         contributorss.map((contributor: any) => {
            gitgubApi.get(`/users/${contributor.login}`, {
               'headers': {
                  'Authorization': `token ${import.meta.env.VITE_ACCESS_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json',
               }
            }).then(data => {
               setUsers(old => [...old, data.data]);
               setIsLoading(false);
            });
         });
      } catch (error) {
         console.log(error);
      }
   }

   if (isLoading) {
      return <Loading />;
   }

   return (
      <>
         <Container className="App" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <Grid container spacing={2} maxWidth={300}>
               <Grid item md={12} mt={2}>
                  <TextField label='Owner' size="small" placeholder="Owner" fullWidth value={owner} onChange={(e) => setOwner(e?.target.value)} />
               </Grid>
               <Grid item md={12} my={1}>
                  <TextField label='Repository' size="small" placeholder="Repository" fullWidth value={repository} onChange={(e) => setRepository(e?.target.value)} />
               </Grid>
               {
                  error &&
                  <Grid item md={12} my={1}>
                     <Chip label="Repository not found" color="error" variant="outlined" />
                  </Grid>
               }
               <Grid item md={12}>
                  <Button size="small" variant='contained' onClick={getContributors} fullWidth>Get info Collaborators</Button>
               </Grid>

            </Grid><br />
         </Container >
         <UserModal open={open} handleClose={() => setOpen(false)} id={id} />
         {
            <Box padding={5}>
               <Table users={users} />
            </Box>
         }
         <Box display='flex' flexWrap='wrap' justifyContent='center'>

            {
               users && users.map((user, i) => {
                  if (user.login === '') return <div key={i}></div>;
                  return (
                     <Card
                        key={i}
                        elevation={1}
                        sx={{ margin: '5px', width: '200px' }}
                        onClick={() => handleUserInfo(user.login)}
                     >
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
                  )
               })
            }
         </Box>
      </>
   )
}

export default Home;