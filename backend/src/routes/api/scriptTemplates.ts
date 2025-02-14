import { Router } from "express";

import * as PageQuestionTemplatesController from "../../controllers/PageQuestionTemplatesController";
import * as QuestionTemplatesController from "../../controllers/QuestionTemplatesController";
import * as ScriptTemplatesController from "../../controllers/ScriptTemplatesController";
import { checkBearerToken } from "../../middlewares/checkBearerToken";
import { BearerTokenType } from "../../types/tokens";

export const router = Router();

router.use(checkBearerToken(BearerTokenType.AccessToken));
router.patch("/:id", ScriptTemplatesController.update);
router.delete("/:id", ScriptTemplatesController.discard);
router.patch("/:id/undiscard", ScriptTemplatesController.undiscard);

router.post("/:id/question_templates", QuestionTemplatesController.create);
router.post(
  "/:id/page_question_templates",
  PageQuestionTemplatesController.create
);

export default router;
