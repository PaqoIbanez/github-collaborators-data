import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useState, ReactNode, useEffect } from 'react';
import { Box } from '@mui/material';
import { UserProps } from '../../interfaces';
import { gitgubApi } from '../Home';
import { LanguagePercentage } from './LanguagePercentage';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiDialogContent-root': {
      padding: theme.spacing(1),
   },
   '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
   },
}));

export interface DialogTitleProps {
   id: string;
   children?: ReactNode;
   onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
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

interface Props {
   id: string;
   open: boolean;

   handleClose: () => void;
}

export default function UserModal({ open, handleClose, id }: Props) {

   const [user, setUser] = useState<UserProps>({
      id: '',
      login: '',
      avatar_url: '',
      name: ''
   })
   const [languages, setLanguages] = useState<string[][number]>([]);

   useEffect(() => {
      if (id === "") return;

      let languages = [];
      let dataInPerCents;
      const fetchData = async () => {
         const { data } = await gitgubApi.get(`/users/${id}`, {
            'headers': { 'Authorization': 'token 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' }
         });
         setUser(data);
         const { data: repos } = await gitgubApi.get(`/users/${id}/repos`, {
            'headers': { 'Authorization': 'token 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' }
         });
         repos.map(async ({ languages_url }) => {
            const { data: languagesFromApi } = await gitgubApi.get(languages_url, {
               'headers': { 'Authorization': 'token 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' }
            });
            languages.push(languagesFromApi);
            let sum = languages.reduce((acc, curr) => {
               Object.entries(curr).forEach(([key, value]) => {
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
            setLanguages(sortable);
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
            maxWidth='xl'
         >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
               {user.name}
            </BootstrapDialogTitle>
            <DialogContent style={{ marginInline: 12 }}>

               <img src={user.avatar_url} alt={user.avatar_url} width={450} />

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