import * as Yup from 'yup';

const pqrsSchema = Yup.object().shape({
  motive: Yup.string()
    .required('Por favor agrega el motivo del PQRS'), // 'motive' es obligatorio
  type: Yup.string(), // 'type' es opcional
  description: Yup.string()
    .required('Este campo es obligatorio'), // 'description' es obligatorio
  files: Yup.array(),
  reportingResident: Yup.object().shape({
    id: Yup.string(),
    photoUrl: Yup.string(),
    fullName: Yup.string(),
    type: Yup.string(),
    unitId: Yup.string()
  }).required('Por favor selecciona el residente que solicita el PQRS').nullable(),
  accusedResident: Yup.object().shape({
    id: Yup.string(),
    photoUrl: Yup.string(),
    fullName: Yup.string(),
    type: Yup.string(),
    unitId: Yup.string()
  }), // 'accusedResident' es opcional
});

export default pqrsSchema;
