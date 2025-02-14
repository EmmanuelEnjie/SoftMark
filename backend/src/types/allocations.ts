import { BaseData, isBaseData } from "./entities";
import {
  QuestionTemplateListData,
  isQuestionTemplateListData
} from "./questionTemplates";
import { PaperUserListData, isPaperUserListData } from "./paperUsers";

export interface AllocationPostData {
  paperUserId: number;
  // TODO: Not in MVP
  // totalAllocated: number;
}

export interface AllocationListData extends BaseData {
  questionTemplateId: number;
  paperUserId: number;
}

export interface AllocationData extends AllocationListData {
  questionTemplate: QuestionTemplateListData;
  paperUser: PaperUserListData;
}

export function isAllocationListData(data: any): data is AllocationListData {
  return (
    typeof data.questionTemplateId === "number" &&
    typeof data.paperUserId === "number" &&
    isBaseData(data)
  );
}

export function isAllocationData(data: any): data is AllocationData {
  return (
    isQuestionTemplateListData(data.questionTemplate) &&
    isPaperUserListData(data.paperUser) &&
    isAllocationListData(data)
  );
}
