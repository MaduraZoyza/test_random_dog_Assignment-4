import { describe, expect, test, vi } from 'vitest'
import { getDogImage } from '../controllers/dogController'
import * as dogService from '../services/dogService'

vi.mock('../services/dogService')

// Simple mock response object
const createMockResponse = () => {
  const res: any = {}
  res.status = vi.fn().mockReturnThis()
  res.json = vi.fn()
  return res
}

describe('DogController.getDogImage', () => {
  test('Return dog image with valid request', async () => {
    const req: any = {}
    const res = createMockResponse()

    // Fake data returned by service
    const mockDogData = {
      imageUrl: 'https://example.com/mock-dog.jpg',
      status: 'success'
    }

    // Mock service function so controller test is isolated
    vi.mocked(dogService.getRandomDogImage).mockResolvedValue(mockDogData)

    await getDogImage(req, res)

    // Controller should return success true and include data
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockDogData
    })
  })
})