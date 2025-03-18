import { CSSProperties } from "react";

export const columns = [
	{ key: "id", header: "ID", styles: {} },
	{ key: "description", header: "Description", styles: {} },
	{ key: "assigneeId", header: "Assigneed To", styles: {}, headerStyles: {} },
	{ key: "completed", header: "Status", styles: {} },
];

export const columnWidths = ["5vw", "25vw", "10vw", "30vw"];

export const RStatus: Record<
	number,
	{
		label: string;
		styles: CSSProperties;
	}
> = {
	1: {
		label: "Completed",
		styles: { color: "green" },
	},
	0: {
		label: "Uncompleted",
		styles: { color: "red" },
	},
};

export const optionsFilter = [
	{ value: "", label: "All" },
	{ value: "true", label: "Completed" },
	{ value: "false", label: "Uncompleted" },
];
