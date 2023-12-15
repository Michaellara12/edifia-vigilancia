import Iconify from "../../../components/iconify/Iconify"

export const templates = [
  // {
  //   icon: (<Iconify icon='ri:openai-fill' />),
  //   title: 'ChatGPT',
  //   description: 'Escribe informes de gestión',
  //   id: 'informe',
  //   projectData: { 
  //     form_title: "¿Sobre qué título quieres obtener ejes temáticos?",
  //     form_placeholder: "p. ej. Cómo triunfar en ventas por internet",
  //     form_input: "",
  //     tipo: "informe",
  //     project_title: "Sin título",
  //     project_caption: "Informe",
  //     inFolder: false
  //   }
  // },
  {
    icon: (<Iconify icon='carbon:report-data' width={24} />),
    title: 'Informes ejecutivos',
    description: 'Escribe informes de gestión',
    id: 'informe',
    projectData: { 
      form_title: "Informe Ejecutivo",
      form_placeholder: "Un informe detallado sobre los principales impulsores de ventas, identifica áreas de mejora y propone acciones específicas para aumentar los ingresos.",
      form_input: "",
      tipo: "informe",
      project_title: "Sin título",
      project_caption: "Informe",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='bi:people-fill' width={24}/>),
    title: 'Actas de Asamblea',
    description: 'Genera actas de asamblea de propietarios',
    id: 'acta_asamblea',
    projectData: { 
      form_title: "Acta de Asamblea",
      form_placeholder: "Redacta un acta de asamblea, incluyendo temas discutidos, decisiones tomadas y acuerdos alcanzados.",
      form_input: "",
      tipo: "acta_asamblea",
      project_title: "Sin título",
      project_caption: "Acta de Asamblea",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='fluent:people-team-48-filled' width={24}/>),
    title: 'Actas de Consejo',
    description: 'Crea actas de las reuniones de consejo de administración',
    id: 'acta_concejo',
    projectData: { 
      form_title: "Acta de Consejo",
      form_placeholder: "Elabora el acta de la reunión del consejo, detallando temas tratados, decisiones acordadas y próximos pasos.",
      form_input: "",
      tipo: "acta_consejo",
      project_title: "Sin título",
      project_caption: "Acta de Consejo",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='heroicons-outline:emoji-happy' width={24}/>),
    title: 'Actas de Convivencia',
    description: 'Crea actas relacionadas con la convivencia y normas de la propiedad',
    id: 'acta_convivencia',
    projectData: { 
      form_title: "Acta de Convivencia",
      form_placeholder: "Registra el acta de convivencia, incluyendo detalles sobre el incidente, medidas tomadas y compromisos de los involucrados.",
      form_input: "",
      tipo: "acta_convivencia",
      project_title: "Sin título",
      project_caption: "Acta de Convivencia",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='codicon:law' width={24}/>),
    title: 'Derechos de Petición',
    description: 'Genera derechos de petición dirigidos a entidades externas',
    id: 'derechos_peticion',
    projectData: { 
      form_title: "Derecho de Petición",
      form_placeholder: "Elabora un derecho de petición dirigido a una entidad externa, describiendo el motivo y solicitando acciones específicas.",
      form_input: "",
      tipo: "derechos_peticion",
      project_title: "Sin título",
      project_caption: "Derecho de Petición",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='fluent:money-20-regular' width={24}/>),
    title: 'Carta de Cobro',
    description: 'Crea cartas de cobro para propietarios con pagos pendientes',
    id: 'carta_cobro',
    projectData: { 
      form_title: "Carta de Cobro",
      form_placeholder: "Redacta una carta de cobro para el propietario con pagos pendientes, incluyendo detalles de la deuda y plazos para el pago.",
      form_input: "",
      tipo: "carta_cobro",
      project_title: "Sin título",
      project_caption: "Carta de Cobro",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='tabler:building-community' width={24}/>),
    title: 'Reglamentos Internos',
    description: 'Crea documentos con las reglas y normas de convivencia interna',
    id: 'reglamentos_internos',
    projectData: { 
      form_title: "Reglamento Interno",
      form_placeholder: "Elabora el reglamento interno de la propiedad, describiendo las normas de convivencia y uso de espacios comunes.",
      form_input: "",
      tipo: "reglamentos_internos",
      project_title: "Sin título",
      project_caption: "Reglamento Interno",
      inFolder: false
    }
  },
  {
    icon: (<Iconify icon='bxs:megaphone' width={24}/>),
    title: 'Notificaciones a Propietarios',
    description: 'Crea notificaciones oficiales dirigidas a los propietarios',
    id: 'notificaciones_propietarios',
    projectData: { 
      form_title: "Notificación a Propietarios",
      form_placeholder: "Elabora una notificación oficial para los propietarios, comunicando cambios, eventos o decisiones relevantes.",
      form_input: "",
      tipo: "notificaciones_propietarios",
      project_title: "Sin título",
      project_caption: "Notificación a Propietarios",
      inFolder: true
    }
  }
]