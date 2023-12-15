// ----------------------------------------------------------------------

export type IFileShared = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    permission: string;
  };
  
  export type IFolderManager = {
    id: string;
    project_title: string;
    tipo: string;
    dateCreated: Date | number | string;
    dateModified: Date | number | string;
    files?: Array<string>;
    inFolder?: boolean;
  };
  
  export type IFileManager = {
    id: string;
    project_title: string;
    tipo: string;
    dateCreated: Date | number | string;
    dateModified: Date | number | string;
    form_input?: string;
    prompt?: string;
    inFolder?: boolean;
  };
  
  export type IFile = IFileManager | IFolderManager;