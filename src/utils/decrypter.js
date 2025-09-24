import CryptoJS from 'crypto-js'

export const decryptSaveFile = async (rawSave) => {
    // ① 读成 ArrayBuffer
    rawSave = await rawSave.arrayBuffer()

    // ② 截掉前后填充
    const trimmed = new Uint8Array(rawSave.slice(25, rawSave.byteLength - 1))

    // ③ Uint8 → 字符串
    const base64Str = uint8ArrayToString(trimmed)

    // ④ AES 解密（CBC 示例，按自己实际改 key/iv/mode）
    const decrypted = decryptAES(base64Str)

    // ⑤ JSON 解析
    return JSON.parse(decrypted)
}
  
  
const uint8ArrayToString = (bytes) => {
    let str = "";
    for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
    return str;
}


const decryptAES = (base64Str) => {
    // Parse Base64 to CryptoJS WordArray
    const cipherWords = CryptoJS.enc.Base64.parse(base64Str);

    // Hardcoded key - extracted from game binaries
    const key = CryptoJS.enc.Utf8.parse("UKu52ePUBwetZ9wNX88o54dnfKRu0T1l");

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherWords }, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    // Convert WordArray to UTF-8 string
    const decryptedStr = CryptoJS.enc.Utf8.stringify(decrypted);

    return decryptedStr;
}