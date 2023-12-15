export type ITranscription = {
    dateCreated?: Date;
    dateModified?: Date;
    form_input: string | undefined;
    id: string;
    project_title: string;
    fileName?: string;
    fileType?: string;
    tipo: "transcription";
    state: 'waiting' | 'ready';
}