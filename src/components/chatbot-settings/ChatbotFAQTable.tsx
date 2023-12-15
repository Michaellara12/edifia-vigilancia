// react
import { useState, useEffect, useRef } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  CardContent,
  Typography,
  Box,
  Skeleton,
  TextField
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, deleteDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// @types
import { IQnA } from '../../@types/chatbot';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import { useSnackbar } from "../../components/snackbar"
// sections
import { ChatbotFaqTableRow, ChatbotFaqTableToolbar } from '../../sections/@dashboard/chatbot-config';
//
import axios from 'axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'question', label: 'Pregunta', align: 'left' },
  { id: 'answer', label: 'Respuesta', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

type faqItemProps = {
  id: string
  question: string
  answer: string
}

export default function ChatbotFAQTable() {

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
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const { user } = useAuthContext()

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, 'users', user?.uid, 'chatbotFaq');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const questions = querySnapshot.docs.map((doc) => doc.data());
        setTableData(questions as faqItemProps[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
  }, []);  

  const [tableData, setTableData] = useState<IQnA[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  // QnA dialog
  const [question, setQuestion] = useState('')

  const [answer, setAnswer] = useState('')

  const [openEditQnADialog, setOpenEditQnADialog] = useState(false)

  const [currentRowId, setCurrentRowId] = useState("")

  const questionRef = useRef<HTMLInputElement>(null)

  const answerRef = useRef<HTMLInputElement>(null)

  function Content() {
    return (
      <Stack gap={3} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Pregunta"
          placeholder='¿Cuáles son los horarios de atención?'
          defaultValue={question}
          inputRef={questionRef}
        />

        <TextField
          fullWidth
          label="Respuesta"
          placeholder='Nuestros horarios de atención en la administración del conjunto residencial son de lunes a viernes de 9:00 AM a 6:00 PM, y los sábados de 10:00 AM a 2:00 PM.'
          defaultValue={answer}
          inputRef={answerRef}
          multiline
        />
      </Stack>
    )
  }

  const onClose = () => {
    setCurrentRowId("")
    setOpenEditQnADialog(false)
  }

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

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Make -> Algolia webhook
  const url = "https://hook.us1.make.com/7kfu9exw2tytmzs4pu1nh81fpfscxdzf"

  const handleDeleteRow = async (id: string) => {
    try {
      const docRef = doc(DB, 'users', user?.uid, 'chatbotFaq', id);
      
      await deleteDoc(docRef);
      
      const payload = {
        type: "FAQ",
        userId: user?.uid,
        itemId: id,
        action: "Delete single doc"
      }

      await axios.post(url, payload)
      
      enqueueSnackbar('Pregunta eliminada');
    } catch (e) {
      enqueueSnackbar('No fue posible eliminar la pregunta', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows: string[]) => {
    try {
        // Delete documents one by one based on selectedRows
        for (const id of selectedRows) {
            const userFaqDocRef = doc(DB, 'users', user?.uid, 'chatbotFaq', id);
            await deleteDoc(userFaqDocRef);
        }

        const payload = {
            type: "FAQ",
            userId: user?.uid,
            itemIds: selectedRows,
            action: "Delete multiple docs"
        }

        await axios.post(url, payload);

        enqueueSnackbar('Preguntas eliminadas');
    } catch (e) {
        enqueueSnackbar('No fue posible eliminar las preguntas', { variant: 'error' });
    }
    setSelected([]);
  };

  const handleOpenEditRowDialog = (id: string) => {
    const rowInfo = tableData.find(question => question.id === id )
    if (rowInfo) {
      setCurrentRowId(rowInfo.id)
      setQuestion(rowInfo.question)
      setAnswer(rowInfo.answer)
      setOpenEditQnADialog(true)
    }
  };

  const handleEditRow = async () => {

    const payload = {
      type: "FAQ",
      userId: user?.uid,
      itemId: currentRowId,
      action: "Edit doc",
      question: questionRef.current?.value,
      answer: answerRef.current?.value,
    }

    await axios.post(url, payload)

    try {
      const docRef = doc(DB, "users", user?.uid, "chatbotFaq", currentRowId);
      const updatedFaq = {
            id: currentRowId,
            question: questionRef.current?.value,
            answer: answerRef.current?.value,
          };
  
      await updateDoc(docRef, updatedFaq);
  
      enqueueSnackbar('Pregunta editada');
    } catch (e) {
      enqueueSnackbar('No fue posible editar la pregunta', { variant: 'error' });
    }
    onClose();
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  if (loading) return <ChatbotFAQTableLoadingComponent />

  return (
    <>
      <>
        <Typography variant='h3' sx={{ mb: 2 }}>Preguntas frecuentes</Typography>
        <Card>
          <ChatbotFaqTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Eliminar">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ChatbotFaqTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onEditRow={() => handleOpenEditRowDialog(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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

      {/* Edit question */}
      <ConfirmDialog 
        title='Editar pregunta y respuesta' 
        content={<Content />}
        action={
          <Button 
            variant='contained' 
            onClick={handleEditRow}
          >
            Editar pregunta
          </Button>
        }
        open={openEditQnADialog}
        onClose={onClose}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            ¿En verdad deseas eliminar <strong> {selected.length} </strong> item(s)?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Eliminar
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IQnA[];
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
      (question) =>
        question.question.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        question.answer.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

const ChatbotFAQTableLoadingComponent = () => {
  return (
      <Card>
          <CardContent>
              <Box
                  sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  pb: 1
                  }}
              >
                  <Skeleton variant="rounded" width='100%' height={80} sx={{ mt: 2 }} />
                  <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 2 }} />
                  <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 1 }} />
                  <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 1 }} />
                  
              </Box>
          </CardContent>
      </Card>
  )
}