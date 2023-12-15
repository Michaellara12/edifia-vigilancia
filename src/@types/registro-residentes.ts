import { CustomFile } from 'src/components/upload';

export type INewResident = {
    type: string
    photoUrl: string
    id: string
    name: string
    lastName: string
    whatsapp?: string
    email?: string
    cedula?: string
  }

export type INewMascot = {
    id: string
    photoUrl: CustomFile | string | null
    type: string
    race?: string
    name: string
    color: string
}

export type INewVehicle = {
  id: string
  photoUrl: CustomFile | string | null
  type: string
  color: string
  brand: string
  licensePlate?: string
  token?: string
}

export type ConjuntoDataProps = {
  docId: string
  photoUrl: string
  name: string
  address: string
  email: string
  phone: string
}

export type RegisterResidentFormValues = {
  type: string
  tower: string
  unit: string
  coef: string
  parkingLot: string
  secondParkingLot: string
  deposit: string
  secondDeposit: string
  residents: INewResident[] | []
  mascots: INewMascot[] | []
  vehicles: INewVehicle[] | []
}