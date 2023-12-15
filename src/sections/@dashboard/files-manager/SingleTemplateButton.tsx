// MUI
import { Button, Stack, Typography } from "@mui/material";
// 
import Router from "next/router";
import { useDashboardLoadingContext } from "src/layouts/DashboardLoadingContext";

// firebase 
import { useAuthContext } from "src/auth/useAuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { DB } from "src/auth/FirebaseContext";

// <---------------------------------------------> //

type NewProjectTabProps = {
    icon: React.ReactNode
    title: string
    description: string
    projectData: {
        form_title: string
        form_placeholder: string
        form_input?: string
        tipo: string
        project_title: string
        project_caption: string
    }
}

export function SingleTemplateButton({icon, title, description, projectData}: NewProjectTabProps) {

    const { setLoading } = useDashboardLoadingContext()
  
    const { user } = useAuthContext();
  
    async function handleTabClick(e:React.MouseEvent<HTMLElement>) {
      e.preventDefault
      try {
        if (user) {
          setLoading(true)
          const collectionRef = collection(DB, "users", user.uid, "documents")
          const docRef = await addDoc(collectionRef, {...projectData, dateCreated: serverTimestamp(), dateModified: serverTimestamp()})
          Router.push(`/dashboard/documentos?document=${docRef.id}`)
        }
      } catch (e) {
        console.log(e)
      }
    } 
  
    return (
      <>
        <Button
            sx={{m: 1, p: '1.5rem'}}
            variant='soft'
            onClick={handleTabClick}
        >
            <Stack
                direction='column'
                spacing={1}
            >
              {icon}
              <Typography variant='subtitle1' align='left'>{title}</Typography>
              <Typography variant='body2' align='left'>{description}</Typography>
            </Stack>
        </Button>
      </>
    )
  }
