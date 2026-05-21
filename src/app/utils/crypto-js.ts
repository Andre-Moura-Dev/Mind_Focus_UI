import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

const SECRET_KEY = environment.crypto.secretKey;

export function encryptItem(data: any): string {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
    ).toString();
}

export function decryptItem<T>(encryptedData: string): T | null {
    try {
        const bytes = CryptoJS.AES.decrypt(
            encryptedData,
            SECRET_KEY
        );

        const decrypted = bytes.toString(
            CryptoJS.enc.Utf8
        );

        if (!decrypted) {
            return null;
        }

        return JSON.parse(decrypted) as T;

    } catch (error) {
        console.error(
            'Erro ao descriptografar:',
            error
        );

        return null;
    }
}

export function setEncryptedItem(key: string, data: any): void {
    try {
        const encrypted = encryptItem(data);
        localStorage.setItem(key, encrypted);
    } catch (error) {
        console.error(`Erro ao salvar o item ${key} criptografado:`, error);
    }
}


export function getDecryptedItem<T>(key: string): T | null {
    try {
        const encryptedData = localStorage.getItem(key);
        if (!encryptedData) {
            return null;
        }
        return decryptItem<T>(encryptedData);
    } catch (error) {
        console.error(`Erro ao buscar o item ${key} descriptografado:`, error);
        return null;
    }
}

export function removeItem(key: string): void {
    localStorage.removeItem(key);
}