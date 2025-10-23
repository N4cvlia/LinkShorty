import { UrlStats } from "./url-stats";

export interface StatsResolveData {
    stats: UrlStats | null;
    error: string | null;
}
