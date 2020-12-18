import { aes } from '../utils/aes'

test('aes encrypt and decrypt', () => {
  expect(aes.decrypt(aes.encrypt('1'))).toBe('1')
})

test('aes encryptObj and decryptObj', () => {
  expect(aes.decryptObj(aes.encryptObj({ a: 'b' }))).toStrictEqual({ a: 'b' })
})
