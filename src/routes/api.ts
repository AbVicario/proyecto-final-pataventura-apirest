import { loginAdmin } from "../controllers/adminController.ts";

export default function (app: any) {
    loginAdmin(app)
    return app
}