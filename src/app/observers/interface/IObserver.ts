export interface Observer {
    created(value: any): Promise<void>;
    deleted(value: string): Promise<void>;
    updated(value: string): Promise<void>;
}