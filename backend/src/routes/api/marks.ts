import { Router } from "express";
import * as MarksController from "../../controllers/MarksController";
import { checkBearerToken } from "../../middlewares/checkBearerToken";
import { BearerTokenType } from "../../types/tokens";
import { canModifyMark } from "../../middlewares/canModifyMark";

export const router = Router();

router.use(checkBearerToken(BearerTokenType.AccessToken));
router.use(canModifyMark);
router.patch("/:id", MarksController.update);
router.delete("/:id", MarksController.discard);
router.patch("/:id/undiscard", MarksController.undiscard);

export default router;
