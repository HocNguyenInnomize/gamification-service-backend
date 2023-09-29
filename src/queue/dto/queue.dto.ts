export interface ElementDTO {
  id: string;
  status: ElementStatus;
  socketClientId: string;
  gameType: string;
  Country: string;
  userId: string;
}

export enum ElementStatus {
  Failed,
  Running,
  Pending,
}

