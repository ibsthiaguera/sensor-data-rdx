import { Request, Response } from "express"
import { DetailLoggedUserService } from "../../services/user/DetailLoggedUserService"

class DetailLoggedUserController {
    async handle(req: Request, res: Response) {

        const user_id = Number(req.user_id)
        const detailLoggedUserService = new DetailLoggedUserService()
        const user = await detailLoggedUserService.execute(user_id)

        return res.json(user)

    }
}

export { DetailLoggedUserController }