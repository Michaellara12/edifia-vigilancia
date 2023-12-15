import { useState, useEffect } from 'react';
// types
import { ContactType } from 'src/@types/crm';
// firebase
import {
  collection,
  query as firestoreQuery,
  where,
  onSnapshot // Changed import
} from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
import { DB } from 'src/auth/FirebaseContext';

// ----------------------------------------------------------------------

const useFetchResidents = (unitId: string) => {
  const { user } = useAuthContext();
  const [residents, setResidents] = useState<ContactType[] | []>([]);

  useEffect(() => {
    if (!user) return;

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

      // Set the contacts data
      setResidents(contactsData);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts or unitId changes
  }, [unitId, user]);

  return {
    residents
  };
};

export default useFetchResidents;
