import { validateOrReject, validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository, IsNull } from "typeorm";
import { pick } from "lodash";

import { ScriptTemplate } from "../entities/ScriptTemplate";
import { PaperUserRole } from "../types/paperUsers";
import { AccessTokenSignedPayload } from "../types/tokens";
import {
  ScriptTemplatePatchData,
  ScriptTemplatePostData
} from "../types/scriptTemplates";
import { allowedRequester, allowedRequesterOrFail } from "../utils/papers";

export async function create(request: Request, response: Response) {
  const payload = response.locals.payload as AccessTokenSignedPayload;
  const requesterId = payload.id;
  const paperId = Number(request.params.id);
  const postData = pick(request.body, "name") as ScriptTemplatePostData;
  const allowed = await allowedRequester(
    requesterId,
    paperId,
    PaperUserRole.Owner
  );
  if (!allowed) {
    response.sendStatus(404);
    return;
  }

  const count = await getRepository(ScriptTemplate).count({
    paperId,
    discardedAt: IsNull()
  });
  if (count > 0) {
    response.sendStatus(400);
    return;
  }
  const scriptTemplate = new ScriptTemplate(paperId);
  if (postData.name !== undefined) {
    scriptTemplate.name = postData.name;
  }
  const errors = await validate(scriptTemplate);
  if (errors.length > 0) {
    response.sendStatus(400);
    return;
  }
  await getRepository(ScriptTemplate).save(scriptTemplate);

  const data = await scriptTemplate.getData();
  response.status(201).json({ scriptTemplate: data });
}

export async function showActive(request: Request, response: Response) {
  const payload = response.locals.payload as AccessTokenSignedPayload;
  const paperId = request.params.id;
  const allowed = await allowedRequester(
    payload.id,
    paperId,
    PaperUserRole.Student
  );
  if (!allowed) {
    response.sendStatus(404);
    return;
  }
  const { paper } = allowed;

  try {
    const scriptTemplate = await getRepository(ScriptTemplate).findOne({
      where: { paper, discardedAt: IsNull() },
      relations: ["pageTemplates", "questionTemplates"]
    });

    const data = scriptTemplate ? await scriptTemplate.getData() : null;
    response.status(200).json({ scriptTemplate: data });
  } catch (error) {
    response.sendStatus(400);
  }
}

export async function update(request: Request, response: Response) {
  const payload = response.locals.payload as AccessTokenSignedPayload;
  const scriptTemplateId = Number(request.params.id);
  const patchData = pick(request.body, "name") as ScriptTemplatePatchData;
  let scriptTemplate: ScriptTemplate;
  try {
    scriptTemplate = await getRepository(ScriptTemplate).findOneOrFail(
      scriptTemplateId,
      { relations: ["pageTemplates", "questionTemplates"] }
    );
    await allowedRequesterOrFail(
      payload.id,
      scriptTemplate.paperId,
      PaperUserRole.Owner
    );
  } catch (error) {
    response.sendStatus(404);
    return;
  }

  try {
    if (patchData.name !== undefined) {
      scriptTemplate.name = patchData.name;
    }
    await validateOrReject(scriptTemplate);
    await getRepository(ScriptTemplate).save(scriptTemplate);

    const data = await scriptTemplate.getData();
    response.status(200).json({ scriptTemplate: data });
  } catch (error) {
    response.sendStatus(400);
  }
}

export async function discard(request: Request, response: Response) {
  const payload = response.locals.payload as AccessTokenSignedPayload;
  const scriptTemplateId = Number(request.params.id);
  let scriptTemplate: ScriptTemplate;
  try {
    scriptTemplate = await getRepository(ScriptTemplate).findOneOrFail(
      scriptTemplateId
    );
    await allowedRequesterOrFail(
      payload.id,
      scriptTemplate.paperId,
      PaperUserRole.Owner
    );
  } catch (error) {
    response.sendStatus(404);
    return;
  }

  try {
    await getRepository(ScriptTemplate).update(scriptTemplateId, {
      discardedAt: new Date()
    });
    response.sendStatus(204);
  } catch (error) {
    response.sendStatus(400);
  }
}

export async function undiscard(request: Request, response: Response) {
  const payload = response.locals.payload as AccessTokenSignedPayload;
  const scriptTemplateId = Number(request.params.id);
  let scriptTemplate: ScriptTemplate;
  try {
    scriptTemplate = await getRepository(ScriptTemplate).findOneOrFail(
      scriptTemplateId
    );
    await allowedRequesterOrFail(
      payload.id,
      scriptTemplate.paperId,
      PaperUserRole.Owner
    );
  } catch (error) {
    response.sendStatus(404);
    return;
  }

  try {
    await getRepository(ScriptTemplate).update(scriptTemplateId, {
      discardedAt: null
    });

    const data = scriptTemplate.getData();
    response.status(200).json({ scriptTemplate: data });
  } catch (error) {
    response.sendStatus(400);
  }
}
