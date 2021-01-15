import { fetchParallel } from '../src/http'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { mocked } from 'ts-jest/utils'

jest.mock('axios')

test('should return fetch data', async () => {
  mocked(axios).mockResolvedValue({
    data: '12345',
    status: 200
  } as AxiosResponse)

  const requests: AxiosRequestConfig[] = []

  for (let id = 0; id <= 100; id++) {
    requests.push({
      method: 'GET',
      url: 'https://github.com'
    })
  }
  const res = await fetchParallel(requests, 30)

  expect(res.length).toBe(100)
  res.forEach((item) => {
    expect(item.status).toBe(200)
    expect(item.data).toBe('12345')
  })
})
