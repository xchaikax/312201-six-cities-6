import { Container } from "inversify";
import { types } from "@typegoose/typegoose";
import { Component } from "../../types/index.js";
import { CommentService } from "./comment-service.interface.js";
import { BaseCommentService } from "./comment.service.js";
import { CommentEntity, CommentModel } from "./comment.entity.js";
import { CommentController } from "./comment.controller.js";

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Component.CommentService).to(BaseCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<CommentController>(Component.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
