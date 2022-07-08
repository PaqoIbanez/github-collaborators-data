import { MDBDataTableV5 } from 'mdbreact';

interface Props {
   users: {}[];
}

export const Table = ({ users }: Props) => {

   const datatable = ({
      columns: [
         {
            label: 'User name',
            field: 'login',
            sort: 'asc',
            width: 250,
            attributes: {
               'aria-controls': 'DataTable',
               'aria-label': 'Name',
            }
         },
         {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 270,
         },
         {
            label: 'Email',
            field: 'email',
            width: 200,
         },
         {
            label: 'Location',
            field: 'location',
            width: 100,
         }
      ],
      rows: users
   });

   return <MDBDataTableV5
      striped
      bordered
      small
      entries={30}
      data={datatable}
      exportToCSV
   />;
}