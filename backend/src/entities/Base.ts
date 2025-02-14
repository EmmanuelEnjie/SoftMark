import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { EntityTokenPayload, BearerTokenType } from "../types/tokens";

export abstract class Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  createPayload = (): EntityTokenPayload<Base> => ({
    type: BearerTokenType.EntityToken,
    id: this.id,
    entityName: this.entityName
  });

  getBase = () => ({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  });

  abstract entityName: string;
}
