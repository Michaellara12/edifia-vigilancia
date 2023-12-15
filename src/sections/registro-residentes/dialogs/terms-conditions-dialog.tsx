import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { hideScrollbarY } from "src/utils/cssStyles";


// --------------------------------------

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

// --------------------------------------

type TermsConditionsDialogProps = {
    open: boolean;
    handleClose: () => void
}

export default function TermsConditionsDialog({ open, handleClose }: TermsConditionsDialogProps) {

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth='xl'
        
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Términos y condiciones
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ ...hideScrollbarY }}>
        <Typography gutterBottom variant='subtitle1'>
            Privacidad y Protección de Datos en Edifia
        </Typography>
          <Typography gutterBottom>
            Bienvenido a Edifia, su plataforma integral para la gestión eficiente de su conjunto residencial. 
            Antes de proceder con el registro de sus datos personales, es importante que comprenda cómo manejamos y protegemos su información. 
            En Edifia, estamos profundamente comprometidos con la seguridad y la privacidad de nuestros usuarios, 
            y nos regimos estrictamente por las normativas vigentes, incluyendo la Ley de Habeas Data y la Ley 675 de 2001.
          </Typography>
          <Typography gutterBottom>
            En Edifia, nos adherimos a estas leyes para garantizar la protección de su información. 
            Esto significa que: Consentimiento Informado: Solo recopilamos datos personales con su 
            consentimiento explícito y le informamos sobre el uso específico que se les dará. 
            Finalidad del Tratamiento de Datos: Utilizamos su información exclusivamente para 
            los fines relacionados con la gestión de correspondencia, autorización de visitas, 
            gestión de proveedores, mantenimiento de equipos e instalaciones, emisión de comunicados, 
            resolución de PQRS, y reservas de zonas comunes. 
            Esta información es esencial para ofrecerle un servicio eficiente y personalizado.
          </Typography>
          <Typography gutterBottom>
            Confidencialidad y Seguridad: Implementamos medidas de seguridad avanzadas para proteger 
            sus datos contra accesos no autorizados, alteraciones indebidas o cualquier forma de vulneración. 
            Acceso y Rectificación: Usted tiene derecho a acceder a sus datos personales, 
            solicitar correcciones o 
            actualizaciones, y exigir su eliminación cuando lo considere pertinente.
          </Typography>

          <Typography gutterBottom variant='subtitle1'>
            Uso y Tratamiento de sus Datos Personales
          </Typography>

          <Typography gutterBottom>
            Al registrarse en Edifia, usted nos proporciona información que incluye, pero no se limita a, 
            su nombre, dirección, número de contacto, correo electrónico, y otros datos relevantes 
            para la gestión de los servicios de su conjunto residencial. Esta información se utiliza 
            para: Gestión de Correspondencia: Para asegurar que sus paquetes y correspondencia sean 
            entregados de manera eficiente y segura. Autorización de Visitas: 
            Para controlar el acceso al conjunto residencial, garantizando su seguridad y la de sus vecinos.
          </Typography>

          <Typography gutterBottom>
          Interacción con Proveedores: Para facilitar la gestión de servicios y suministros necesarios 
          para el mantenimiento y operación del conjunto. Mantenimiento de Equipos e Instalaciones: 
          Para programar y realizar mantenimientos preventivos y correctivos de manera oportuna. 
          Comunicados y Anuncios: Para mantenerlo informado sobre asuntos relevantes relacionados 
          con su conjunto residencial. Resolución de PQRS: Para atender eficientemente cualquier 
          petición, queja, reclamo o sugerencia que tenga. Reservas de Zonas Comunes: 
          Para facilitar la reserva y uso de áreas comunes dentro del conjunto residencial. 
          No Comercialización de sus Datos En Edifia, nos comprometemos a no vender, alquilar 
          o compartir su información personal con terceros para fines de marketing o publicidad. 
          Su privacidad es nuestra prioridad, y mantenemos sus datos estrictamente para los fines 
          mencionados anteriormente. 
          Transparencia y Control Usted tiene control total sobre sus datos personales en nuestra plataforma.
          </Typography>

          <Typography gutterBottom>
            En cualquier momento, puede acceder a su perfil para actualizar o modificar su información. 
            Si tiene preguntas o inquietudes sobre cómo manejamos sus datos, o si desea ejercer sus 
            derechos de acceso, rectificación, cancelación u oposición, no dude en contactarnos. 
            Actualizaciones de Nuestra Política de Privacidad Nos reservamos el derecho de modificar 
            esta política de privacidad para reflejar cambios en nuestras prácticas de manejo de datos 
            o en la legislación vigente. Cualquier cambio será comunicado a través de nuestra plataforma 
            y/o canales de comunicación habituales. En Edifia, su confianza y seguridad son esenciales. 
            Al proporcionarnos sus datos, usted nos permite hacer de su conjunto residencial un lugar más 
            seguro, eficiente y agradable para vivir. 
            Agradecemos su colaboración y estamos a su disposición para cualquier consulta o aclaración.
          </Typography>

          <Typography gutterBottom>
            Definición y Alcance de la Ley de Habeas Data: Comienza la sección explicando brevemente qué es la Ley de Habeas Data, destacando su propósito de garantizar a los ciudadanos el control sobre sus datos personales y su tratamiento por parte de terceros.
            Conformidad de Edifia con la Ley de Habeas Data: Aclara cómo Edifia sigue las directrices de esta ley. Por ejemplo, menciona que la plataforma solo recopila y procesa datos personales con el consentimiento explícito del usuario y para los fines específicamente declarados.
            Derechos del Titular de los Datos: Enumera los derechos que tienen los usuarios bajo la Ley de Habeas Data, como el derecho a conocer, actualizar y rectificar sus datos personales, así como el derecho a solicitar prueba del consentimiento otorgado para el tratamiento de sus datos.
            Medidas de Seguridad y Confidencialidad: Describe las medidas de seguridad implementadas por Edifia para proteger los datos personales de los usuarios, en conformidad con los requerimientos de la Ley de Habeas Data.
            Procedimientos para Ejercer Derechos Relacionados con Datos Personales: Proporciona una guía clara sobre cómo los usuarios pueden ejercer sus derechos de acceso, corrección, cancelación u oposición de sus datos personales en la plataforma de Edifia.
            Compromiso de Actualización y Cumplimiento: Finaliza la sección reafirmando el compromiso de Edifia de mantenerse actualizado con las modificaciones a la Ley de Habeas Data y ajustar sus prácticas de protección de datos en consecuencia.
        </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant='contained'>
            Cerrar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
