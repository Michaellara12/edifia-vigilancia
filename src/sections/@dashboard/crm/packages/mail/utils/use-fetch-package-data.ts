import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// types
import { IPackage, ContactType } from 'src/@types/crm';
// firebase
import { doc, getDoc, collection, query as firestoreQuery, where, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB } from 'src/auth/FirebaseContext';
//
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const useFetchPackageData = () => {
  const { query } = useRouter();
  const itemId = query.itemId as string;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [packageData, setPackageData] = useState<IPackage | null>(null);
  const [residents, setResidents] = useState<ContactType[] | []>([]);

  const getContactsData = async (unitId: string) => {
    // Reference the 'residents' collection and apply a query to filter by 'unitId'
    const residentsCollectionRef = collection(DB, 'basic-crm', user?.uid, 'residents');
    const q = firestoreQuery(residentsCollectionRef, where('unitId', '==', unitId));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: ContactType[] = [];
  
      snapshot.forEach((doc) => {
        const contactData = doc.data();
        const contact = {
            ...contactData,
            fullName: `${contactData.name} ${contactData.lastName}`
        } as ContactType;
        contactsData.push(contact);
      });
      // Set the contacts data and loading state
      setResidents(contactsData);
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    });
  
    // To stop listening when the component unmounts or when you no longer need updates
    return unsubscribe;
  };

  const getPackageData = async () => {
    setLoading(true);

    if (itemId) {
      const docRef = doc(DB, 'basic-crm', user?.uid, 'packages', itemId);

      try {
        const docData = await getDoc(docRef);

        if (docData.exists()) {
          const data = docData.data() as IPackage;
          setPackageData({ ...data });
          await getContactsData(data.unitId)
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' })
      } finally {
        setLoading(false);
      }
    } else {
      setError(true);
      setLoading(false);
      enqueueSnackbar(`Parece que este paquete no existe`, { variant: 'error' })
    }
  };

  useEffect(() => {
    getPackageData();
  }, [itemId]);

  return {
    loading,
    error,
    packageData,
    residents
  };
};

export default useFetchPackageData;
