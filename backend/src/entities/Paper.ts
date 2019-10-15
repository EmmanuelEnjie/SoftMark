import {
  IsNotEmpty,
  IsString
} from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Discardable } from "./Discardable";
import { PaperUser } from "./PaperUser";
import { QuestionTemplate } from "./QuestionTemplate";

@Entity()
export class Paper extends Discardable {
  entityName = "Paper";

  @Column()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @OneToMany(type => PaperUser, paperUser => paperUser.paper)
  paperUsers!: PaperUser[];

  @OneToMany(type => QuestionTemplate, questionTemplate => questionTemplate.paper)
  questionTemplates!: QuestionTemplate[];
}