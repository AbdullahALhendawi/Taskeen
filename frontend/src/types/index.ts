export interface Building {
  id: string;
  name: string;
  createdAt: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
}

export interface Apartment {
  id: string;
  floorId: string;
  apartmentNumber: number;
}

export interface Room {
  id: string;
  apartmentId: string;
  roomNumber: number;
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: number;
  residentId: string | null;
}

export interface Resident {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  nationality: string;
  jobTitle: string;
}