import { Timestamp } from 'firebase/firestore';
import { CustomFile } from 'src/components/upload';

// -------------------------------------------------------------------------

export type IResident = {
    type: IResidentType
    tower?: string
    unit: string
    photoUrl: string
    id: string
    name: string
    lastName: string
    unitId: string
    whatsapp?: string
    email?: string
    company?: string
    cedula?: string
}

export type IResidentType = 'Propietario' |  'Arrendatario' | 'Inmobiliaria'

// -------------------------------------------------------------------------

export type IUnit = {
  id: string
  coef: string
  photoUrl: string
  type: 'Apartamento' | 'Casa'
  tower?: string
  unit: string
  deposit?: string
  secondDeposit?: string
  parkingLot?: string
  secondParkingLot?: string
  mascots: IUnitMascot[] | []
}

export type IUnitMascot = {
  id: string
  photoUrl: string
  type: string
  race?: string
  name: string
  color: string
}

export type IUnitVehicle = {
  id: string
  photoUrl: string
  brand: string
  color: string
  licensePlate?: string
  type: string
  token?: string
  unitId: string
  lastActivity: ILastActivityVehicle
}

export type ILastActivityVehicle = {
  timestamp: Timestamp
  id: string
  unitId: string
  authAction: 'Registro' | 'Ingreso' | 'Salida'
}

// -------------------------------------------------------------------------

export type IVisitor = {
  id: string;
  photoUrl: string;
  cedulaPhotoUrl?: string;
  signature?: string;
  name: string;
  cedula: string;
  type: 'Visitante' | 'Proveedor';
  notes?: string;
  company?: string;
  unitId: string;
  residentId: string;
  accessType: 'Peatonal' | 'Vehicular';
  arrivalDate: Timestamp;
  exitDate?: Timestamp;
  vehicle?: IVisitorVehicle
  parkingTime?: string
  parkingCost?: number
  authGuard?: IGuard
}

type IVisitorVehicle = {
  vehiclePhotoUrl: string;
  vehicleType?: string;
  vehicleLicensePlate?: string;
  vehicleColor?: string;
  vehicleBrand?: string;
  vehicleParkingLot?: string;
}

// -------------------------------------------------------------------------

export type IDelivery = {
  id: string
  photoUrl: string
  authResident?: IAuthResident
  residentId: string
  arrivalDate: Timestamp
  exitDate?: Timestamp
  unitId: string
  notes?: string
}

export type IAuthResident = {
  id: string
  photoUrl: string
  fullName: string
  name: string
  lastName: string
  type: IResidentType
  unitId: string
  tower: string
  unit: string
}

export type ContactType = {
  id: string
  name: string
  lastName: string
  photoUrl: string
  type: string
  unitId: string
  fullName: string
}

// -------------------------------------------------------------------------

export type IPackage = {
  id: string
  photoUrl: string
  signature?: string
  arrivalDate: Timestamp
  pickupDate: Timestamp | null | undefined
  tower?: string
  unit: string
  unitId: string
  name: string
  lastName: string
  type: 'Paquete' | 'Sobre'
  size: 'Pequeño' | 'Mediano' | 'Grande' | 'Muy Grande'
  notes?: string
  residentId?: string
  company?: string
  authGuard?: IGuard
}

// -------------------------------------------------------------------------

export type IProvider = {
  id: string
  companyName: string
  nit: string
  phone: string
  email: string
  contactName: string
  service: string
  website: string
}

// -------------------------------------------------------------------------

export type IMinuta = {
  id: string
  timestamp: Timestamp
  notes: string
  authGuard: IGuard
}

// -----------------------------------

export type IGuard = {
  id: string; // Esta es la cédula o documento de identidad
  name: string;
  gender: string
  photoUrl: CustomFile | string | null;
  avatarUrl: string;
  isActive: boolean;
}