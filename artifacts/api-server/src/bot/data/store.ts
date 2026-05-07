export const ADMIN_ROLE_ID = "1297881409012240445";
export const PRISON_ROLE_ID = "1456560553282764830";
export const CITIZEN_ROLE_ID = "1305984216835555359";

export interface ViolationEntry {
  id: number;
  officerName: string;
  violatorId: string;
  reason: string;
  price: number;
  images: string[];
  paid: boolean;
  timestamp: Date;
}

export interface AutoReplyRule {
  trigger: string;
  response: string;
}

export interface AfkEntry {
  reason: string;
  since: number;
  username: string;
}

export interface WarnEntry {
  reason: string;
  by: string;
  at: Date;
}

export const prisonStore = new Map<string, string[]>();
export const violationsStore = new Map<string, ViolationEntry[]>();
export const violationCounters = new Map<string, number>();
export const autoRepliesStore = new Map<string, AutoReplyRule[]>();
export const afkStore = new Map<string, AfkEntry>();
export const warningsStore = new Map<string, WarnEntry[]>();
