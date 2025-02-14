import { AllocationListData } from "backend/src/types/allocations";
import { DiscardableData } from "backend/src/types/entities";
import { UserData } from "backend/src/types//users";

export enum PaperUserRole {
  Owner = "OWNER",
  Marker = "MARKER",
  Student = "STUDENT"
}

export function isPaperUserRole(role: any): role is PaperUserRole {
  return Object.values(PaperUserRole).includes(role);
}

export interface PaperUserPostData {
  email: string;
  role: PaperUserRole;
}

export type PaperUserPatchData = Partial<{
  role: PaperUserRole;
}>;

export interface PaperUserListData extends DiscardableData {
  user: UserData;
  role: PaperUserRole;
  allocations: AllocationListData[];
  markCount: number;
  bookmarkCount: number;
}

export interface PaperUserData extends PaperUserListData {}
