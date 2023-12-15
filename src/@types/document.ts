import { Timestamp } from 'firebase/firestore'

// --------------------------------------

export type IDocument = {
    id: string;
    form_input: string;
    project_title: string
    tipo: string;
    template?: string;
    state?: 'waiting' | 'ready'
}

type OutputType = {
    id: string;
    outputText: string;
    dateModified: Date | number | string;
}

export type IGptOutput = OutputType | null

export type IDocumentBuilder = {
    form_input?: string
    proyectoId: string
    projectTitle: string
    gptOutputs: Array<IGptOutput>
}

// --------------------------------------------

// Templates
export type IConvocatoria = {
    id: string
    isLoading: boolean
    project_title: string
    formValues: IConvocatoriaFormValues
}

type IConvocatoriaFormValues = {
    fecha: Timestamp
    tipoConvocatoria: 'Ordinaria' | 'Extraordinaria'
    tipoAsistencia: 'Virtual' | 'Presencial' | 'Mixta'
    orden: string
    tipoReunion: 'Reunión de consejo' | 'Asamblea de copropietarios'
}

export type IActaConsejo = {
    id: string
    isLoading: boolean
    project_title: string
    formValues: IActaConsejoFormValues
}

type IActaConsejoFormValues = {
    numeroActa: string
    puntosVarios: string
    fecha: Timestamp
    fechaCierre: Timestamp
    orden: string
    asistentes: string
}

export type IInformeGestion = {
    id: string
    isLoading: boolean
    project_title: string
    formValues: IInformeGestionFormValues
}

type IInformeGestionFormValues = {
    mes: string
    gestionAdministrativa: string
    mantenimientos: string
    cartera: string
    convivencia: string
}