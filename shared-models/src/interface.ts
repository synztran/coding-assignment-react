export type User = {
	id: number;
	name: string;
};

export type Ticket = {
	id: number;
	description: string;
	assigneeId: number | null;
	completed: boolean;
};

export enum EnumStatus {
	"Uncompleted",
	"Completed",
}

export type TicketStatus = "Uncompleted" | "Completed" | "";
