import prismaClient from "../../prisma"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

interface AuthRequest {
    email: string
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {

        // verificar se email confere
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error("User/Password incorrect!")
        }

        // verificar se a senha confere
        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error("User/Password incorrect!")
        }

        // verificar se o usuário está ativo
        if (user.status !== 'ativo') {
            throw new Error("User must be active!")
        }

        // gerar um token JWT e devolver dados do usuario, como id, name e email
        const token = sign(
            {
                name: user.name,
                email: user.email,
                
            },
            process.env.JWT_SECRET,
            {
                subject: `${user.id}`,
                expiresIn: '30d'
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            token
        }
    }
}

export { AuthUserService }