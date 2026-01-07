import type {
  CellReport,
  CellStatus,
  ChurchStatus,
  Disciple,
  SoulWinningReport,
} from "@/app/generated/prisma";

// Create a type for the roles
export type UserAccountRole = "admin" | "leader" | "stranger";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserAccountRole;
      pastor?: boolean;
    };
  }
}

export type PageInfo = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  itemCount: number;
};

export type Option = {
  label: string;
  value: string;
};

export type DateRange =
  | "today"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "last_last_month"
  | "year_to_date"
  | "last_year"
  | "custom";

export interface DiscipleRecord extends Disciple {
  leader: Pick<Disciple, "id" | "name"> | null;
  handledBy: Pick<Disciple, "name"> | null;
}

export interface CellReportRecord extends CellReport {
  date: string;
  rawDate: Date;
  leader: {
    name: string;
    id: string;
    userAccountId: string | null;
  };
  lesson: {
    id: string;
    scriptureReferences: string[];
    lessonSeries: {
      id: string;
      title: string;
    };
    title: string;
  } | null;
  assistant: {
    name: string;
    id: string;
    isMyPrimary: boolean;
    isPrimary: boolean;
  } | null;
  cellReportAttendeeSnapshots: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    churchStatus: ChurchStatus;
    status: CellStatus;
    discipleId: string;
    cellReportId: string;
  }[];
}

export interface SimpleCellReport extends CellReportRecord {
  date: string;
}

export interface SoulWinningReportRecord extends SoulWinningReport {
  date: string;
  rawDate: Date;
  networkLeader: {
    name: string;
    id: string;
    userAccountId: string | null;
  };
  lesson: {
    id: string;
    scriptureReferences: string[];
    lessonSeries: {
      id: string;
      title: string;
    };
    title: string;
  };
  assistantLeader: {
    name: string;
    id: string;
    isMyPrimary: boolean;
    isPrimary: boolean;
  } | null;
  newBelievers: {
    name: string;
    id: string;
  }[];
}
