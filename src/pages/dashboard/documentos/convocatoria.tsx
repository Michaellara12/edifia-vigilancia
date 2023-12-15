// other
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { Skeleton, Box, Container } from '@mui/material';
// components
import NoProjectFound from 'src/components/content-builder/NoProjectFound'
import AddEditConvocatoria from 'src/sections/@dashboard/templates/add-edit-convocatoria';
import GptRequestLoadingScreen from 'src/sections/@dashboard/templates/gpt-request-loading-screen';
// Firebase
import { 
  collection, 
  onSnapshot, 
  doc, 
  QuerySnapshot, 
  DocumentData, 
  query as firebaseQuery, 
  orderBy 
} from 'firebase/firestore'
import { DB } from 'src/auth/FirebaseContext';
import { useAuthContext } from 'src/auth/useAuthContext';
// types
import { IGptOutput, IConvocatoria } from 'src/@types/document';

// ----------------------------------------------------------------------

Convocatoria.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Convocatoria() {

  const [gptOutputs, setGptOutputs] = useState<IGptOutput[]>([]);
  
  const [formValues, setFormValues] = useState<IConvocatoria>();

  const [error, setError] = useState(false);
  
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthContext();

  const { query } = useRouter();

  const documentId = query.document as string;
  
  if (user && documentId) {
    const collectionRef = collection(DB, "users", user.uid, "documents", documentId, "gptOutputs")
    const q = firebaseQuery(collectionRef, orderBy('timestamp', 'desc'))
    const docRef = doc(DB, "users", user.uid, "documents", documentId)

    useEffect(() => {
      const fetchDocData = () => {
        setLoading(true);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const docData = docSnap.data();
            setFormValues(docData as IConvocatoria);
          } else {
            setError(true);
          }
        }, (error) => {
          setError(true);
        });
    
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
      };
    
      fetchDocData();
    }, [documentId, query]);

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
    }, [documentId])
  }

  useEffect(() => {
    setLoading(false)
  }, [formValues, error])

  if (loading) return (<LoadingFormData />)

  if (error) return (<NoProjectFound />)

  if (formValues?.isLoading) return <GptRequestLoadingScreen />

  if (formValues && !formValues.isLoading) return (
    <>
      <AddEditConvocatoria currentDocument={formValues} gptOutputs={gptOutputs} />
    </>
  )
}

// ----------------------------------------------------------------------

function LoadingFormData() {
    return (
      <Container maxWidth='md'>
        <Box
            sx={{
                alignSelf: 'center',
                mt: -20,
                width: '100%'
            }}
        >
          <Skeleton height={800}/>
        </Box>
      </Container>
    )
  }
  