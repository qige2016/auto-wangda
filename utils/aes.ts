import CryptoJS from 'crypto-js'

export class Aes {
  aeskey: string

  constructor() {
    this.aeskey = 'd8cg8gVakEq9Agup'
  }

  encrypt(text: string): string {
    if (!text) return text

    const key = CryptoJS.enc.Utf8.parse(this.aeskey)
    const str = CryptoJS.enc.Utf8.parse(text)
    const encrypted = CryptoJS.AES.encrypt(str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  }

  decrypt(text: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.aeskey)
    const decrypted = CryptoJS.AES.decrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  encryptObj(data: { [k: string]: string }): { [k: string]: string } {
    const temp = {}
    for (const key in data) {
      temp[key] = this.encrypt(data[key])
    }
    return temp
  }

  decryptObj(data: { [k: string]: string }): { [k: string]: string } {
    const temp = {}
    for (const key in data) {
      temp[key] = this.decrypt(data[key])
    }
    return temp
  }
}

export const aes = new Aes()
