export interface ExportData {
    shortUrl: string;
    originalUrl: string;
    clicks: number;
    avgClicksPerDay: string;
    createdDate: string;
    shortCode: string;
    chartData: { date: string; clicks: number }[];
    topCountries: { country: string; count: number }[];
    deviceStats: { name: string; value: number }[];
    browserStats: { name: string; value: number }[];
    recentClicks: any[];
    formatDistanceToNow: (date: string) => string;
}
