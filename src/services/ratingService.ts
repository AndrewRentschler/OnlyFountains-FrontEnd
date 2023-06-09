import { Rating } from "../types/models";
import * as tokenService from './tokenService'

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/rating`

async function getRatingsByFountainId(id: string): Promise<Rating[]> {
  const res = await fetch(`${BASE_URL}/get-ratings/${id}`)
  return await res.json() as Rating[]
}

async function getAllRatings(): Promise<Rating[]> {
  const res = await fetch(`${BASE_URL}/`)
  return await res.json() as Rating[]
}

async function addRating(rating: Rating): Promise<Rating> {
  const res = await fetch(`${BASE_URL}/add-rating`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(rating),
  })
  return await res.json() as Rating
}

async function updateRating(rating: Rating): Promise<Rating> {
  const res = await fetch(`${BASE_URL}/update-rating/${rating.fountainId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(rating),
  })
  return await res.json()
}

async function deleteRating(id: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/delete-rating/${id}`, {
    method: 'DELETE',
  })
  return await res.json() as string
}

export { getRatingsByFountainId, addRating, updateRating, deleteRating, getAllRatings }