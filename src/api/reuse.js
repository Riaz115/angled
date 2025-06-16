import CryptoJS from 'crypto-js';

 export const encryptUserData = (data, secretKey) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
    return encryptedData.toString();
 }

 export const decryptUserData = (data,secretEnKey) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, secretEnKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
