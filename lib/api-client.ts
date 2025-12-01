import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
});

export const API_ENDPOINTS = {
  GET_CLERK_USERS: "/clerk-user-accounts",
  GET_LEADERS: "/leaders",
  GET_ASSISTANT_LEADERS: "/assistant-leaders",
  GET_DISCIPLES: "/disciples",
  GET_LESSON_SERIES: "/lesson-series",
  GET_LESSONS: "/lessons",
  GET_MEMBER_STATISTICS: "/reports/member-statistics",
  GET_CELLGROUP_STATISTICS: "/reports/cell-group-statistics",
  GET_CELLREPORT_TREND: "/reports/cell-report-trend",
  GET_CHURCH_MEMBERS: "/attendance/church-members",
  GET_RETURNEES: "/attendance/returnees",
  GET_ATTENDANCE: "/attendance",

  // GCC Resources
  GET_PREACHING_FOLDERS: "/gcc-resources/preaching-folders",
  GET_RESOURCES_FOLDERS: "/gcc-resources/resources-folders",

  // SEND EMAIL"
  POST_SEND_CELL_REPORT_REMINDER: "/send-cell-report-reminder",
};
