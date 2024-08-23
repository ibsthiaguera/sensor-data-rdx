import prismaClient from "../../prisma"
import { hash } from "bcryptjs"

interface UserRequest {
    name: string
    email: string
    password: string
    status: string
}

class CreateUserService {
    async execute({ name, email, password, status }: UserRequest) {

        // verificar se enviou email
        if (!email) {
            throw new Error("Email incorrect")
        }

        // verificar se o email está cadastrado
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (userAlreadyExists) {
            throw new Error("User already exists")
        }

        const passwordHash = await hash(password, 8)

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                status: status
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true
            }
        })

        return user
    }
}

export { CreateUserService }