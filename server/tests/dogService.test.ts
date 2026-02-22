import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { getRandomDogImage } from '../services/dogService'

describe('DogService.getRandomDogImage', () => {
  // Clear mocks so tests don’t affect each other
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('should return a dog image when API call is successful', async () => {
    // Mock Dog API response (no real internet call)
    const mockApiResponse = {
      message: 'https://example.com/mock-dog.jpg',
      status: 'success'
    }

    // Mock fetch to return success
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse
    } as any)

    // Call service
    const result = await getRandomDogImage()

    // Check mapping: message -> imageUrl
    expect(result.imageUrl).toBe(mockApiResponse.message)
    expect(result.status).toBe('success')

    // fetch should be called once
    expect(global.fetch).toHaveBeenCalledOnce()
  })

  test('should throw an error when API call fails', async () => {
    // Mock fetch to return failed response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as any)

    // Check the service throws correct error message
    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    )

    expect(global.fetch).toHaveBeenCalledOnce()
  })
})