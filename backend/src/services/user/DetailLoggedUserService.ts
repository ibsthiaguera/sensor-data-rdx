import prismaClient from "../../prisma"

class DetailLoggedUserService {
    async execute(user_id: number) {

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
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

export { DetailLoggedUserService}