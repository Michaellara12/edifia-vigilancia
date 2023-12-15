// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/acceso/ingresar',
  ingreso: '/acceso/ingresar',
  registro: '/acceso/registro',
  restablecer: '/acceso/restablecer-contrasena',
  confirmacion: '/acceso/confirmacion-cambio'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  cuenta: path(ROOTS_DASHBOARD, '/cuenta'),
  redaccion: path(ROOTS_DASHBOARD, '/redaccion'),
  configuracion: {
    root: path(ROOTS_DASHBOARD, '/configurar-chatbot'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/configurar-chatbot/${name}`),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
    viewChat: (conversationKey: string) => path(ROOTS_DASHBOARD, `/chat?conversationKey=${conversationKey}`)
  },
  gestion: {
    root: path(ROOTS_DASHBOARD, '/gestion'),
    residentes: path(ROOTS_DASHBOARD, '/gestion/residentes'),
    unidades: path(ROOTS_DASHBOARD, '/gestion/unidades'),
    proveedores: path(ROOTS_DASHBOARD, '/gestion/proveedores'),
    visitantes: path(ROOTS_DASHBOARD, '/gestion/visitantes'),
  },
  pqrs: { 
    root: path(ROOTS_DASHBOARD, '/pqrs'),
    newPqrs: path(ROOTS_DASHBOARD, '/pqrs/nuevo-pqrs') 
  },
  calendario: {
    root: path(ROOTS_DASHBOARD, '/calendario'),
  },
  plantillas: {
    root: path(ROOTS_DASHBOARD, '/plantillas'),
    view: (templateId: string) => path(ROOTS_DASHBOARD, `/plantillas/${templateId}`)
  },
  documentos: {
    root: path(ROOTS_DASHBOARD, '/documentos'),
    transcriptionView: (itemId: string) => path(ROOTS_DASHBOARD, `/documentos/?document=${itemId}`),
    view: (templateType: string, templateId: string) => path(ROOTS_DASHBOARD, `/documentos/${templateType}/?document=${templateId}`)
  },
  registroVigilantes: {
    root: path(ROOTS_DASHBOARD, '/registro-vigilantes')
  },
  registroCorrespondencia: {
    root: path(ROOTS_DASHBOARD, '/registro-correspondencia'),
    newMail: path(ROOTS_DASHBOARD, '/registro-correspondencia/nuevo-registro'),
    deliverMail: path(ROOTS_DASHBOARD, '/registro-correspondencia/entregar-paquete')
  },
  registroIngresoPersonas: {
    root: path(ROOTS_DASHBOARD, '/registro-ingreso'),
    newPerson: path(ROOTS_DASHBOARD, '/registro-ingreso/nuevo-registro'),
    newPersonCedula: path(ROOTS_DASHBOARD, '/registro-ingreso/nuevo-registro-cedula'),
  },
  controlVehicular: {
    root: path(ROOTS_DASHBOARD, '/control-vehicular'),
  },
  domicilios: {
    root: path(ROOTS_DASHBOARD, '/domicilios')
  },
  minuta: {
    root: path(ROOTS_DASHBOARD, '/minuta')
  }
};