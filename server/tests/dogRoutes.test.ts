import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { Request, Response } from 'express'
import app from '../index'
import * as dogController from '../controllers/dogController'

vi.mock('../controllers/dogController')

describe('Dog routes', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset mocks after each test
    vi.resetAllMocks()
  })

  test('GET /api/dogs/random returns dog image', async () => {
    const mockImageUrl = 'https://example.com/mock-dog.jpg'

    // Mock controller implementation (so no real service/API call)
    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req: Request, res: Response) => {
        res.status(200).json({
          success: true,
          data: {
            imageUrl: mockImageUrl,
            status: 'success'
          }
        })
      }
    )

    const res = await request(app).get('/api/dogs/random')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.imageUrl).toBe(mockImageUrl)
  })

  test('GET /api/dogs/random returns 500 on error', async () => {
    const errorMessage = 'Failed to fetch dog image: Network error'

    // Mock controller to simulate error response
    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req: Request, res: Response) => {
        res.status(500).json({
          success: false,
          error: "Failed to fetch dog image: Network error"
        })
      }
    )

    const res = await request(app).get('/api/dogs/random')

    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBe(errorMessage)
  })
})