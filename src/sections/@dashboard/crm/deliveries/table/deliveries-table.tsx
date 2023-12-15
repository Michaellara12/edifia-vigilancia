import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Card,
  Table,
  Button,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { collection, onSnapshot, limit, query as firestoreQuery } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableLoadingComponent } from 'src/components/loading-components/TableLoadingComponent';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  TableToolbar
} from 'src/components/table';
import AddDeliveryDialog from '../add-delivery-dialog';
// hooks
import { useSnackbar } from "src/components/snackbar";
import { useBoolean } from 'src/hooks/useBoolean';
// sections
import DeliveriesTableRow from './deliveries-table-row';
// @types
import { IDelivery } from 'src/@types/crm';

// ----------------------------------

const TABLE_HEAD = [
  { id: 'unitId', label: 'Unidad' },
  { id: 'residentId', label: 'Residente que autorizó', minWidth: 160 },
  { id: 'lastActivity', label: 'Última actividad', minWidth: 200 },
  { id: 'notes', label: 'Notas / observaciones', minWidth: 160 }
];

// ----------------------------------------------------------------------

export default function DeliveriesTable() {

  const [loading, setLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar()

  // table
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const { user } = useAuthContext()

  const [tableData, setTableData] = useState<IDelivery[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(DB, 'basic-crm', user?.uid, 'deliveries');
    const limitedQuery = firestoreQuery(collectionRef, limit(150));
    const unsubscribe = onSnapshot(limitedQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => doc.data());

        // Sort items based on the most recent activity
        items.sort((a, b) => {
          // Check for existence of the dates before using them
          const aArrivalDate = a.arrivalDate && a.arrivalDate.toDate();
          const aExitDate = a.exitDate && a.exitDate.toDate();
          const bArrivalDate = b.arrivalDate && b.arrivalDate.toDate();
          const bExitDate = b.exitDate && b.exitDate.toDate();

          const aDate = aExitDate || aArrivalDate;
          const bDate = bExitDate || bArrivalDate;

          if (!aDate || !bDate) return 0;  // if one or both dates are missing, consider them equal

          // Compare dates
          return bDate.getTime() - aDate.getTime();
        });

        setTableData(items as IDelivery[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const openDialog = useBoolean(false);

  // Table
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'all' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  if (loading) return <TableLoadingComponent />

  return (
    <Container maxWidth='md'>
      <>
        <Typography variant='h3' sx={{ mb: 2 }}>Domicilios</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Busca por torre o unidad'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '35%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="ep:food" />}
                  onClick={openDialog.onToggle}
                >
                  Agregar domicilio
                </Button>
            }
          />

          <TableContainer>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DeliveriesTableRow
                        key={row.id}
                        row={row}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </>

      <AddDeliveryDialog open={openDialog.value} onClose={openDialog.onToggle}/>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IDelivery[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}) {

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) =>
        item.unitId.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 
    );
  }

  return inputData;
}