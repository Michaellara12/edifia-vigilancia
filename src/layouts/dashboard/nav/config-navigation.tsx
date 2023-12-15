// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// icons
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    subheader: 'Portería',
    items: [
      { 
        title: 'Correspondencia', 
        path: PATH_DASHBOARD.registroCorrespondencia.root, 
        icon: <Iconify icon='uiw:mail-o'/> 
      },
      { 
        title: 'Visitas', 
        path: PATH_DASHBOARD.registroIngresoPersonas.root, 
        icon: <Iconify icon='mdi:person-multiple'/> 
      },
      { 
        title: 'Domicilios', 
        path: PATH_DASHBOARD.domicilios.root, 
        icon: <Iconify icon='ion:fast-food-outline'/> 
      },
      { 
        title: 'Control vehicular', 
        path: PATH_DASHBOARD.controlVehicular.root, 
        icon: <Iconify icon='fa6-solid:motorcycle'/> 
      },
      { 
        title: 'Minuta de vigilancia', 
        path: PATH_DASHBOARD.minuta.root, 
        icon: <Iconify icon='healthicons:security-worker' width={26}/> 
      }
    ],
  },
  // {
  //   subheader: 'Gestión',
  //   items: [
  //     { 
  //       title: 'Contactos', 
  //       path: PATH_DASHBOARD.gestion.root, 
  //       icon: <Iconify icon='mdi:people-group'/>,
  //       children: [
  //         { title: 'Residentes', path: PATH_DASHBOARD.gestion.residentes },
  //         { title: 'Unidades', path: PATH_DASHBOARD.gestion.unidades },
  //         // { title: 'Proveedores', path: PATH_DASHBOARD.gestion.proveedores },
  //         // { title: 'PQRS', path: PATH_DASHBOARD.gestion.pqrs },
  //       ] 
  //     },
      // { title: 'PQRS', path: PATH_DASHBOARD.pqrs.root, icon: <Iconify icon='fluent:tag-error-16-regular'/> },
      // { title: 'Registro de vigilantes', path: PATH_DASHBOARD.registroVigilantes.root, icon: <Iconify icon='carbon:group-security' width={22}/> },
      // { title: 'Equipos e instalaciones', path: PATH_DASHBOARD.pqrs.root, icon: <Iconify icon='vaadin:tools'/> },
  //   ],
  // },
  // {
  //   subheader: 'Comunicaciones',
  //   items: [
  //     { title: 'Chat', path: PATH_DASHBOARD.chat.root, icon: <Iconify icon='bx:chat'/> },
  //     { title: 'Preguntas frecuentes', path: PATH_DASHBOARD.configuracion.root, icon: <Iconify icon='tabler:message-question'/> },
  //   ],
  // },
  // {
  //   subheader: 'Eventos',
  //   items: [
  //     { title: 'Calendario', path: PATH_DASHBOARD.calendario.root, icon: <Iconify icon='fa:calendar'/> },
  //   ],
  // },
  // {
  //   subheader: 'Redacción',
  //   items: [
  //     { title: 'Datos copropiedad', path: PATH_DASHBOARD.cuenta, icon: <Iconify icon='ci:building-03'/> },
  //     { title: 'Mis documentos', path: PATH_DASHBOARD.redaccion, icon: <Iconify icon='ion:documents-outline'/> },
  //     {
  //       title: 'Plantillas',
  //       path: PATH_DASHBOARD.plantillas.root,
  //       icon: <Iconify icon='ci:file-edit'/>,
  //       children: [
  //         { title: 'Convocatoria', path: PATH_DASHBOARD.plantillas.view('convocatoria') },
  //         { title: 'Acta de consejo', path: PATH_DASHBOARD.plantillas.view('acta-de-consejo') },
  //         // { title: 'Acta de asamblea', path: PATH_DASHBOARD.plantillas.view('acta-de-asamblea') },
  //         { title: 'Informe de gestión', path: PATH_DASHBOARD.plantillas.view('informe-de-gestion') },
  //         // { title: 'Informe de asamblea', path: PATH_DASHBOARD.plantillas.view('informe-de-asamblea') },
  //       ],
  //     }
  //   ],
  // }
];

export default navConfig;
