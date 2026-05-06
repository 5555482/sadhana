import { UserYatraData, Yatra, YatraPractice, YatraUser } from "../../api/yatras";

export const sampleYatras: Yatra[] = [
  {
    id: "morning-japa",
    name: "Morning Japa",
    statistics: null,
    show_stability_metrics: true
  },
  {
    id: "reading-circle",
    name: "Reading Circle",
    statistics: null,
    show_stability_metrics: false
  }
];

export const sampleYatraPractices: YatraPractice[] = [
  {
    id: "japa",
    practice: "Japa",
    data_type: "Int",
    colour_zones: null,
    daily_score: null
  },
  {
    id: "reading",
    practice: "Reading",
    data_type: "Duration",
    colour_zones: null,
    daily_score: null
  }
];

export const sampleYatraRows: UserYatraData[] = [
  {
    user_id: "madhava",
    user_name: "Madhava",
    row: [16, "45m"],
    trend_arrow: "up",
    stability_heatmap: [88, 92, 100, 80, 76, 94, 98]
  },
  {
    user_id: "radha",
    user_name: "Radha",
    row: [12, "30m"],
    trend_arrow: "steady",
    stability_heatmap: [70, 85, 90, 96, 90, 87, 91]
  }
];

export const sampleYatraUsers: YatraUser[] = [
  { user_id: "madhava", user_name: "Madhava", is_admin: true },
  { user_id: "radha", user_name: "Radha", is_admin: false }
];
