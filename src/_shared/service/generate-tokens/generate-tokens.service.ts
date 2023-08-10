import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateTokensService {
    createToken() {
        const tokenLength = 32; // 32 characters (128 bits)
        const randomValues = new Uint8Array(tokenLength);

        if (
        typeof window !== 'undefined' &&
        window.crypto &&
        window.crypto.getRandomValues
        ) {
        // For modern browsers that support crypto.getRandomValues()
        window.crypto.getRandomValues(randomValues);
        } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        // For Node.js environment using crypto
            crypto.getRandomValues(randomValues);
        } else {
        // Fallback method using Math.random() (not recommended for security-critical applications)
        for (let i = 0; i < tokenLength; i++) {
            randomValues[i] = Math.floor(Math.random() * 256);
        }
        }

        // Convert the random values to hexadecimal representation
        let token = '';
        for (let i = 0; i < tokenLength; i++) {
            token += randomValues[i].toString(16).padStart(2, '0');
        }

        return token;
    }
}
