import { useRouter } from 'next/router';
// react
import { SetStateAction, Dispatch, createContext, useState, useContext } from "react";
// firebase
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, UploadTask, getDownloadURL } from "firebase/storage";
import { STORAGE, DB } from 'src/auth/FirebaseContext';
// @types
import { FileObject } from "src/components/upload";
// hooks
import { useSnackbar } from "src/components/snackbar"
import { useAuthContext } from 'src/auth/useAuthContext';
// utils
import { uploadFileFormat, fileData } from 'src/components/file-thumbnail';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------

interface UploaderContextProps {
  progress: number;
  setProgress: (value: number) => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  isResumed: boolean;
  setIsResumed: (value: boolean) => void;
  handleCancel: () => void;
  handlePause: () => void;
  handleResume: () => void;
  setUploadTask: Dispatch<SetStateAction<UploadTask | null>>;
  files: FileObject[];
  setFiles: Dispatch<SetStateAction<FileObject[]>>;
  handleUpload: () => void;
  handleTranscribe: () => void;
  handleRemoveFile: (inputFile: File | string) => void;
  handleRemoveAllFiles: () => void;
  handleRemoveUploadingFile: (inputFile: FileObject) => void;
  openUploadFile: boolean;
  handleOpenUploadFile: () => void;
  handleCloseUploadFile: () => void;
  uploadingFiles: boolean;
}

const UploaderContext = createContext<UploaderContextProps | null>(null);

interface FileUploaderContextProps {
  children: React.ReactNode;
}

export const FileUploaderContext = ({ children }: FileUploaderContextProps) => {

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [openUploadFile, setOpenUploadFile] = useState(false);

  const { query: { chatroomId, conversationKey } } = useRouter();

  // File dialog toggle
  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };

  // individual file state
  const handlePause = () => {
    try {
      uploadTask?.pause();
      setIsPaused(true);
      setIsResumed(false);  
    } catch (error) {
      enqueueSnackbar(`Oops error inesperado: ${error}`, { variant: 'error' })
    }
  };

  const handleResume = () => {
    try {
      uploadTask?.resume();
      setIsResumed(true);
      setIsPaused(false);  
    } catch (error) {
      enqueueSnackbar(`Oops error inesperado: ${error}`, { variant: 'error' })
    }
  };

  const handleUpload = async () => {

    setUploadingFiles(true);
    const currentFiles = files.map((file) => ({ blob: file.blob, state: "pending" }));
    setFiles(currentFiles);

    for (let i = 0; i < files.length; i++) {
      const file = currentFiles[i];
      if (file.state === 'finished') {
        return
      }
      
      const uploadingFile = { blob: file.blob, state: "uploading" };
      let filesArray = currentFiles;
      filesArray[i] = uploadingFile;
      setFiles(filesArray);

      try {
        const storageRef = ref(STORAGE, `/${user?.uid}/chatfiles/${conversationKey}/${file.blob.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file.blob);
        uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let prog = Math.floor(progress);
          setProgress(prog);
        }, (error) => {
          console.log(error);
        });

        setUploadTask(uploadTask);

        await uploadTask;

				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const { path = '', preview = '', name = '' } = fileData(file.blob);

        const url = 'https://hook.us1.make.com/dyio5znlhbg8lmeqw038n7jo869718ox';
  
        const format = uploadFileFormat(path || preview);

        const payload = {
          chatroomId: chatroomId,
          leadPhoneNumber: conversationKey,
          fileUrl: downloadURL,
          type: format,
          fileName: name
        };
        
        await axios.post(url, payload);

        const finishedFile = { blob: file.blob, state: "finished" };
       
        let filesArray = currentFiles;

        filesArray[i] = finishedFile;
        
        setFiles(filesArray);
        setProgress(0);
      } catch (error) {

        if (error.code !== 'storage/canceled') {
          enqueueSnackbar('Oops error inesperado: ' + error, { variant: 'error' });
        }

        const cancelledFile = { blob: file.blob, state: "cancelled" };
        
        let filesArray = currentFiles;

        filesArray[i] = cancelledFile;
        
        setFiles(filesArray);
        
        setProgress(0);
      }

    setProgress(0);
      
    }

    setUploadingFiles(false);

    enqueueSnackbar('Archivos enviados')

    handleCloseUploadFile()

  };

  // Upload audio files to transcribe
  const handleTranscribe = async () => {

    setUploadingFiles(true);

    const currentFiles = files.map((file) => ({ blob: file.blob, state: "pending" }));
    
    setFiles(currentFiles);

    for (let i = 0; i < files.length; i++) {

      const transcriptionDocId = uuidv4()

      const file = currentFiles[i];

      if (file.state === 'finished') {
        return
      }
      
      const uploadingFile = { blob: file.blob, state: "uploading" };
      
      let filesArray = currentFiles;

      filesArray[i] = uploadingFile;
      
      setFiles(filesArray);

      try {

        const storageRef = ref(STORAGE, `${user?.uid}/transcriptions/${file.blob.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file.blob);

        uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let prog = Math.floor(progress);
          setProgress(prog);
        }, (error) => {
          console.log(error);
        });

        setUploadTask(uploadTask);

        await uploadTask;

				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const { path = '', preview = '', name = '' } = fileData(file.blob);

        const docRef = doc(DB, 'users', user?.uid, 'documents', transcriptionDocId);

        const url = 'https://hook.us1.make.com/pivl7powzs1cntp55gyja5g2j4icdo2n';
  
        const format = uploadFileFormat(path || preview);

        const payload = {
          userId: user?.uid,
          fileUrl: downloadURL,
          type: format,
          fileName: name,
          transcriptionDocId: transcriptionDocId,
          path: path
        };
        
        await axios.post(url, payload);

        const finishedFile = { blob: file.blob, state: "finished" };
       
        let filesArray = currentFiles;

        filesArray[i] = finishedFile;
        
        setFiles(filesArray);

        setProgress(0);

        // Create Firestore document with the same UUID as the document ID
        await setDoc(docRef, {
          dateCreated: new Date(),
          dateModified: new Date(),
          form_input: '',
          id: transcriptionDocId,
          project_title: name,
          fileName: name,
          fileType: format,
          filePath: path,
          state: 'waiting',
          inFolder: false,
          tipo: 'transcription'
        });
        
      } catch (error) {

        if (error.code !== 'storage/canceled') {
          enqueueSnackbar('Oops error inesperado: ' + error, { variant: 'error' });
        }

        const cancelledFile = { blob: file.blob, state: "cancelled" };
        
        let filesArray = currentFiles;

        filesArray[i] = cancelledFile;
        
        setFiles(filesArray);
        
        setProgress(0);
      }

    setProgress(0);
      
    }

    setUploadingFiles(false);

    enqueueSnackbar('Los archivos se subieron con éxito')

    handleCloseUploadFile()

  };
  
  const handleCancel = () => {
    try {
      setIsPaused(false);
      uploadTask?.cancel();
    } catch (error) {
      enqueueSnackbar(`Oops error inesperado: ${error}`, { variant: 'error' })
    }
  };

  const handleRemoveUploadingFile = (inputFile: FileObject) => {
    if (inputFile.state === 'uploading') {
      handleCancel()
    }
    const filtered = files.filter((file) => {
      if (typeof file.blob === 'string') {
        return file.blob !== inputFile.blob;
      } else {
        return file.blob !== inputFile.blob;
      }
    });
    setFiles(filtered);
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => {
      if (typeof file === 'string') {
        return file !== inputFile;
      } else {
        return file.blob !== inputFile;
      }
    });
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    handleCancel();
    setFiles([]);
  };

  return (
    <UploaderContext.Provider
      value={{
        progress,
        setProgress,
        isPaused,
        setIsPaused,
        isResumed,
        setIsResumed,
        handleCancel,
        handlePause,
        handleResume,
        setUploadTask,
        files,
        setFiles,
        handleUpload,
        handleTranscribe,
        handleRemoveFile,
        handleRemoveAllFiles,
        handleRemoveUploadingFile,
        openUploadFile,
        handleOpenUploadFile,
        handleCloseUploadFile,
        uploadingFiles
      }}
    >
      {children}
    </UploaderContext.Provider>
  );
};

export default FileUploaderContext;

export const useFileUploaderContext = () => {
  const context = useContext(UploaderContext);

  if (!context) throw new Error('Unexpected context error');

  return context;
};