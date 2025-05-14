export interface SendNotificationDto {
    userId?: string; // Optional for sending to all users
    title: string;
    body: string;
    name: string;
}