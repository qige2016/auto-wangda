const CryptoJS = require('crypto-js')

const aeskey = 'd8cg8gVakEq9Agup'

// Encrypt

/**
 * @param {*等待加密的字符串} word
 */

const encrypt = word => {
  if (!word) return word

  const key = CryptoJS.enc.Utf8.parse(aeskey)
  const str = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

const decrypt = encrypted => {
  const key = CryptoJS.enc.Utf8.parse(aeskey)
  const decryptedData = CryptoJS.AES.decrypt(encrypted, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptedData.toString(CryptoJS.enc.Utf8)
}

/**
 * @param {*等待加密的对象} obj
 */

const encryptObj = obj => {
  let t = {}
  for (let key in obj) {
    t[key] = encrypt(obj[key])
  }
  return t
}

const decryptObj = obj => {
  let t = {}
  for (let key in obj) {
    t[key] = decrypt(obj[key])
  }
  return t
}
module.exports = { encrypt, decrypt, encryptObj, decryptObj }
