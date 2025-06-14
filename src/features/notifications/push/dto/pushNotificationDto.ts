export interface SendNotificationDto {
    userId?: string; // Optional for sending to all users
    title: string;
    body: string;
    name: string;
    publicationId?: string;
    commentBody?: string; // Optional for comment notifications
    commentUserId?: string; // Optional for comment notifications
}





