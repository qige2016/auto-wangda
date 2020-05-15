const aes = require('../../utils/aes')

test('aes encrypt and decrypt', () => {
  expect(aes.decrypt(aes.encrypt('1'))).toBe('1')
})
