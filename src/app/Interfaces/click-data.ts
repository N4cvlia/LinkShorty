export interface ClickData {
    id: string;
    clicked_at: string;
    referrer: string | null;
    user_agent: string | null;
    country: string | null;
    city: string | null;
    device_type: string | null;
    browser: string | null;
    os: string | null;
}
