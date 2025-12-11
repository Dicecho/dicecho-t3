import { ObjectId } from "mongodb";

// User reference type
export interface UserRef {
  _id: ObjectId;
  nickName: string;
  avatarUrl: string;
}

// Scenario document interface - matches MongoDB collection structure
export interface ScenarioDocument {
  _id: ObjectId;
  title: string;
  originTitle: string;
  alias: string;
  description: string;
  coverUrl: string;
  origin: string;
  originUrl: string;
  imageUrls: string[];
  playerNumber: [number, number];
  boothAliaseId?: number;
  cnmodsAliaseId?: number;
  moduleRule: string;
  moduleDownloadUrl?: string;
  relatedLinks: Array<{
    name: string;
    url: string;
  }>;
  linkMetas: Record<
    string,
    {
      link: string;
      clickCount: number;
    }
  >;
  modFiles: Array<{
    name: string;
    size: number;
    url: string;
    type: string;
    clickCount?: number;
  }>;
  tags: string[];
  releaseDate: Date;
  author?: ObjectId;
  contributors: ObjectId[];
  editors: ObjectId[];
  foreignAuthor?: {
    id?: string;
    avatarUrl?: string;
    nickName: string;
  };
  languages: string[];
  rateAvg: number;
  validRateCount: number;
  replayCount: number;
  topicCount: number;
  rateCount: number;
  markCount: number;
  rateInfo: Record<string, number>;
  isForeign: boolean;
  isNSFW: boolean;
  invalid: boolean;
  invalidReportCount: number;
  lastRateAt?: Date;
  lastEditAt: Date;
  reportedCode: string;
  reportedCount: number;
  reportedReason: string;
  createdAt: Date;
  updatedAt: Date;
}

// Scenario with populated author field
export interface ScenarioWithAuthor extends Omit<ScenarioDocument, "author"> {
  author?: UserRef;
}

// Scenario with populated contributors
export interface ScenarioWithContributors
  extends Omit<ScenarioDocument, "contributors"> {
  contributors: UserRef[];
}

// Fully populated scenario
export interface ScenarioPopulated
  extends Omit<ScenarioDocument, "author" | "contributors"> {
  author?: UserRef;
  contributors: UserRef[];
}
