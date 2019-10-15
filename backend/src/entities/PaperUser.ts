import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { Discardable } from "./Discardable";
import { Paper } from "./Paper";
import { User } from "./User";
import { PaperUserRole } from "../types/paperUsers";

@Entity()
export class PaperUser extends Discardable {
  entityName = "PaperUser";

  @ManyToOne(type => Paper, paper => paper.paperUsers)
  paper!: Paper;

  @ManyToOne(type => User, user => user.paperUsers)
  user!: User;

  @Column({
    type: "enum",
    enum: PaperUserRole
  })
  @IsNotEmpty()
  @IsEnum(PaperUserRole)
  role!: PaperUserRole;
}