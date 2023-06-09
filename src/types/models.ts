/* ---------===== custom props ====--------- */
export interface Coords {
  lat: number;
  lng: number;
}

export interface Fountain {
  id: number;
  lat: number;
  lon: number;
  tags: JSON;
}

export interface Rating {
  value: number;
  raterId: number;
  fountainId: number;
}

/* ---------===== auth models =====--------- */

export interface Profile {
  name: string;
  photo?: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  email: string;
  profile: { id: number };
  id: number;
  createdAt: string;
  updatedAt: string;
}
