import { Request } from "express";
import { ResponseBody } from "../../../../shared/libs/rest/index.js";
import { CreateCommentDto } from "../dto/create-comment.dto.js";
import { ParamOfferId } from "../../offer/index.js";

export type CreateCommentRequest = Request<ParamOfferId, ResponseBody, CreateCommentDto>;
