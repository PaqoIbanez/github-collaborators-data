import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { LanguagePercentage } from './LanguagePercentage';
import { gitgubApi } from '../api/api';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiDialogContent-root': {
      padding: theme.spacing(1),
   },
   '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
   },
}));

const BootstrapDialogTitle = (props) => {
   const { children, onClose, ...other } = props;

   return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
         {children}
         {onClose ? (
            <IconButton
               aria-label="close"
               onClick={onClose}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
         ) : null}
      </DialogTitle>
   );
};



export default function UserModal({ open, handleClose, id }) {

   const [user, setUser] = useState({
      id: '',
      login: '',
      avatar_url: '',
      name: ''
   })
   const [languages, setLanguages] = useState([]);

   useEffect(() => {
      if (id === "") return;

      let languages = [];
      let dataInPerCents;
      const fetchData = async () => {
         const { data } = await gitgubApi.get(`/users/${id}`, {
            'headers': {
               'Authorization': `token ${import.meta.env.VITE_ACCESS_TOKEN}`,
               'Accept': 'application/vnd.github.v3+json',
            }
         })
         setUser(data);
         const { data: repos } = await gitgubApi.get(`/users/${id}/repos`, {
            'headers': {
               'Authorization': `token ${import.meta.env.VITE_ACCESS_TOKEN}`,
               'Accept': 'application/vnd.github.v3+json',
            }
         });
         repos.map(async ({ languages_url }) => {
            const { data: languagesFromApi } = await gitgubApi.get(languages_url, {
               'headers': {
                  'Authorization': `token ${import.meta.env.VITE_ACCESS_TOKEN}`,
                  'Accept': 'application/vnd.github.v3+json',
               }
            });
            languages.push(languagesFromApi);
            let sum = languages.reduce((acc, curr) => {
               Object.entries(curr).forEach(([key, value]) => {
                  // if (key === 'JavaScript' || key === 'TypeScript') return; //add if you want to ignore these
                  if (acc[key]) acc[key] += curr[key];
                  else acc[key] = value;
               })
               return acc;
            }, {})

            dataInPerCents = [sum].map(item => {
               const itemCopy = { ...item };
               const keys = Object.keys(itemCopy).filter(key => key !== "date");
               const sum = keys.reduce((sum, key) => sum + itemCopy[key], 0);
               keys.forEach(key => itemCopy[key] = parseFloat((100 * itemCopy[key] / sum).toFixed(1)));
               itemCopy.top3 = keys.sort((key1, key2) => item[key2] - item[key1]).slice(0, 3); // Asked in comment below
               return itemCopy;
            });
            const objLanguages = dataInPerCents[0];

            let sortable = [];

            for (const arrLanguages in objLanguages) {
               sortable.push([arrLanguages, objLanguages[arrLanguages]]);
            }
            const a = sortable.sort((a, b) => a[1] + b[1]);
            setLanguages(a);
         })

      }
      fetchData().catch(console.error);
   }, [id]);
   return (
      <div>
         <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth='md'
            fullWidth
         >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
               {user.name}
            </BootstrapDialogTitle>
            <DialogContent style={{ marginInline: 20 }}>
               <Box textAlign='center' mb='20px'>
                  <img src={user.avatar_url} alt={user.avatar_url} width={320} />
               </Box>

               <Grid container>
                  <Grid item md={6}>

                     <Box pt={2} maxWidth={450}>

                        <Typography variant="h6" component="div">
                           User: {user.login}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                           {
                              user.location && `Location: ${user.location.substring(0, 100)}`
                           }
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                           {
                              user.bio && user.bio.length > 150 ? '...' : ''
                           }
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                           {
                              user.email && `Email: ${user.email}`
                           }
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                           {
                              user.bio && `Bio: ${user.bio}`
                           }
                        </Typography>

                     </Box>
                  </Grid>
                  <Grid item md={6}>
                     <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&layout=compact&langs_count=20`} width='400px' />
                  </Grid>
               </Grid>


               {
                  languages.map((language, i) => {
                     if (language[0] === 'top3') return;
                     return (
                        <Box display='flex' flexDirection='row' key={i} >
                           <Typography variant="subtitle2" color="text.secondary" sx={{ mr: '10px' }} >
                              {language[0]}
                           </Typography>
                           <LanguagePercentage percentage={language[1]} />
                        </Box>
                     )
                  })
               }

            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>
                  Cerrar
               </Button>
            </DialogActions>
         </BootstrapDialog>
      </div>
   );
}
