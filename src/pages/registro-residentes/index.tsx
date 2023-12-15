import { useRouter } from 'next/router';
import {useEffect, useState} from 'react'
// next
import Head from 'next/head';
// 
import { Container } from '@mui/material';
// sections
import RegistroDatosForm from 'src/sections/registro-residentes/registro-datos-form';
import LoadingScreen from 'src/components/loading-components/LoadingScreen';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { getDoc, doc } from 'firebase/firestore';
import Page404 from '../404';
//
import { ConjuntoDataProps } from 'src/@types/registro-residentes';

// ----------------------------------------------------------------------

export default function RegisterPage() {

  const { query: { formId } } = useRouter();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [conjuntoData, setConjuntoData] = useState<ConjuntoDataProps>({
    docId: '',
    name: '',
    address: '',
    phone: '',
    photoUrl: '',
    email: ''
  })

  const getDocData = async (formId: string) => {
    const docRef = doc(DB, 'users', formId as string)
    const docData = await getDoc(docRef)
    if (docData.exists()) {
      const data = { ...docData.data() }
      setConjuntoData({
        docId: formId as string,
        name: !!data.name ? data.name : '',
        photoUrl: !!data.photoUrl ? data.photoUrl : '/assets/illustrations/apto.png',
        email: !!data.email ? data.email : '',
        phone: !!data.phone ? data.phone : '',
        address: !!data.address ? data.address : '',
      })
      setLoading(false)
    } else {
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    if (!!formId) {
      getDocData(formId as string)
    }
  }, [formId])

  if (loading) return (<LoadingScreen/>)

  if (error) return (<Container maxWidth='sm' sx={{ mt: 5 }}><Page404 /></Container>)

  return (
    <>
      <Head>
        <title>Registro residentes | Edifia</title>
      </Head>

      <RegistroDatosForm conjuntoData={conjuntoData}/>
    </>
  );
}