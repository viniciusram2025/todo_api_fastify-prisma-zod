import crypto from 'node:crypto';

export function encryptedPassword(password: string) {
    
    const salt = crypto.randomBytes(16).toString("base64");

    const hashPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("base64")

    return { hashPassword, salt }
}

interface IComparePassword {
    candidatePassword: string,
    salt: string,
    hashPassword: string
}

export function comparePassword({
    candidatePassword,
    hashPassword,
    salt
}: IComparePassword) {
    const candidateHash = crypto
        .pbkdf2Sync(candidatePassword, salt, 1000, 64, "sha512")
        .toString("base64");

    if(candidateHash === hashPassword) {
        return true
    } else {
        throw new Error("message: Passowrd doesn't match.")
    }
}