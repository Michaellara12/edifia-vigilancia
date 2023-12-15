// other
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { Skeleton, Box } from '@mui/material';
import { useSnackbar } from "src/components/snackbar"; 

// components
import DocumentBuilder from 'src/components/content-builder/document-builder';
import NoProjectFound from 'src/components/content-builder/NoProjectFound'
import Transcription from 'src/sections/@dashboard/files-manager/transcriptions/Transcription';

// Firebase
import { 
  collection, 
  onSnapshot, 
  doc, 
  QuerySnapshot, 
  DocumentData, 
  getDoc, 
  query as firebaseQuery, 
  orderBy 
} from 'firebase/firestore'
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';

// types
import { IDocument, IGptOutput } from 'src/@types/document';

// ----------------------------------------------------------------------

DocumentPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function DocumentPage() {

  const [gptOutputs, setGptOutputs] = useState<IGptOutput[]>([]);
  
  const [formValues, setFormValues] = useState<IDocument>();

  const [error, setError] = useState(false);
  
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthContext();

  const { query } = useRouter();

  const { enqueueSnackbar } = useSnackbar()

  const documentUuid = query.document as string;
  
  if (user && documentUuid) {
    const collectionRef = collection(DB, "users", user.uid, "documents", documentUuid, "gptOutputs")
    const q = firebaseQuery(collectionRef, orderBy('timestamp', 'desc'))
    const docRef = doc(DB, "users", user.uid, "documents", documentUuid)

    useEffect(() => {
      const fetchDocData = async () => {
        setLoading(true)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const newObj = {...docSnap.data()} as IDocument;
          setFormValues(newObj)
          setLoading(false)
        } else {
          setError(true)
        }
      };
      fetchDocData();
    }, [documentUuid, query]);

    useEffect(() => {
      const unsubscribe = onSnapshot(q, (snapshot:QuerySnapshot<DocumentData>) => {
        const outputs = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            outputText: doc.data().outputText,
            dateModified: doc.data().dateModified?.toDate().getTime(), 
          } as IGptOutput;
        });
        setGptOutputs(outputs)
      })
      return () => {
        unsubscribe();
      };
    }, [documentUuid])

  }

  useEffect(() => {
    setLoading(false)
  }, [formValues, error])

  if (loading) return (<LoadingFormData />)

  if (error) return (<NoProjectFound />)

  if (formValues?.tipo === 'transcription' && formValues?.state) return (
    <Transcription 
      form_input={formValues.form_input}
      id={documentUuid}
      tipo='transcription'
      project_title={formValues.project_title}
      state={formValues.state}
    />
  )

  return (
    <>
      {formValues 
        ?
          <DocumentBuilder 
            form_input={formValues.form_input}
            proyectoId={documentUuid}
            projectTitle={formValues.project_title}
            gptOutputs={gptOutputs}
          /> 
        :
          <LoadingFormData />
      } 
    </>
  )
}

// ----------------------------------------------------------------------

function LoadingFormData() {
    return (
      <Box
        sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
      >
        <Box
            sx={{
                alignSelf: 'center',
                mt: -20,
                width: {lg: '60%', xs: '90%' }
            }}
        >
          <Skeleton height={800}/>
        </Box>
      </Box>
    )
  }
  