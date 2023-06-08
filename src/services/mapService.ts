import { Fountain } from "../types/models"

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/fountain`


async function getFountains(lat: number, lon:number, rad: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${lat}/${lon}/${rad}`)
  const data = await res.json()
  return await data;
}

async function getFountainById(id: string): Promise<Fountain> {
  const res = await fetch(`${BASE_URL}/fountain/${id}`)
  return await res.json() as Fountain
}

export { getFountains, getFountainById }