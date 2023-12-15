export type ProjectType = {
    form_title: string
    form_placeholder: string
    form_input?: string
    proyectoId: string
    tipo: string
    project_title: string
    state?: 'waiting' | 'ready'
}

type OutputType = {
    id: string;
    outputText: string;
    dateModified: Date | number | string;
}

export type gptOutputType = OutputType | null

export type ContentBuilderType = {
    form_title: string
    form_placeholder: string
    form_input?: string
    proyectoId: string
    tipo: string
    projectTitle: string
    gptOutputs: Array<gptOutputType>
}