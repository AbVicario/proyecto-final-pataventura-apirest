import { loginAdmin } from "../controllers/adminController.js";

export default function (app: any) {
    loginAdmin(app)
    return app
}