import * as bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10

    return await bcrypt
        .hash(password, saltRounds)
        .then((hash: string) => {
            return hash
        })
        .catch((err: string) => {
            return err
        })
}

export const verfifyPassword = async (
    password: string,
    hash: string
): Promise<Boolean> => {

    return await bcrypt
        .compare(password, hash)
        .then((result: Boolean) => {
            return result
        })
        .catch((err: string) => {
            return false
        })
}