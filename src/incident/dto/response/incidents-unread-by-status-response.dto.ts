export class IncidentsUnreadByStatusResponseDTO {

  readonly totalUnreadOpen: number;
  readonly totalUnreadPending: number;
  readonly totalUnreadClosed: number;
  readonly totalUnread: number;

  constructor(
    totalUnreadOpen: number,
    totalUnreadPending: number,
    totalUnreadClosed: number,
    totalUnread: number,
  ) {
    this.totalUnreadOpen = totalUnreadOpen;
    this.totalUnreadPending = totalUnreadPending;
    this.totalUnreadClosed = totalUnreadClosed;
    this.totalUnread = totalUnread;
  }

}