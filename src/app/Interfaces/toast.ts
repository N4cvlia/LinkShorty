export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
}
