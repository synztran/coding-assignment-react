import { RStatus } from "@acme/shared-constants";
import { Ticket, TicketStatus, User } from "@acme/shared-models";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddNew from "../addNew";
import Filter from "../filter";
import CircularLoading from "../loading";
import "./styles.css";

interface IProps {
	data: Ticket[];
	columns: {
		key: string;
		header: string;
		styles: React.CSSProperties;
		headerStyles?: React.CSSProperties;
	}[];
	users: User[];
	mapUsers?: { [key: number]: string };
	isFetching?: boolean;
}

function DynamicTable(props: IProps) {
	const navigate = useNavigate();
	const { data, columns, isFetching = false } = props;
	const [isRedirecting, setRedirecting] = useState(false);
	const [targetId, setTargetId] = useState<number | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("");

	if (!Array.isArray(data) || !Array.isArray(columns)) {
		console.error("Data and columns must be valid arrays.");
		return null;
	}

	const formatData = useMemo(() => {
		if (!data || data.length === 0) {
			return [];
		}

		return data.map((row) => {
			let formattedRow: {
				id: number;
				description: string;
				completed: string;
				assigneeId: string;
				styles?: string;
			} = {
				id: row.id,
				description: "",
				completed: "",
				assigneeId: "",
				styles: "",
			};

			columns.forEach((column) => {
				switch (column.key) {
					case "id":
						column.headerStyles = {
							width: "10%",
						};
						break;
					case "description":
						formattedRow[column.key] = row[column.key];
						column.headerStyles = {
							width: "40%",
						};
						break;
					case "completed":
						const value = Number(row[column.key]);
						formattedRow[column.key] = RStatus?.[value]?.label;
						column.headerStyles = {
							width: "20%",
						};
						break;
					case "assigneeId":
						const assigneeTo = row?.assigneeId
							? props.mapUsers?.[row?.assigneeId]
							: "Unassigned";
						formattedRow[column.key] = assigneeTo || "Unassigned";
						column.styles = {
							textAlign: "right",
						};
						column.headerStyles = {
							textAlign: "right",
							width: "10%",
						};
						break;
					default:
						break;
				}
			});

			return formattedRow;
		});
	}, [data]);

	const handleRedirect = (id: number) => {
		setRedirecting(true);
		setTargetId(Number(id));
		navigate(`/${id}`);
	};

	return (
		<div className="container">
			<div className="headContainer">
				<Filter
					selectedStatus={selectedStatus}
					setSelectedStatus={setSelectedStatus}
				/>
				<AddNew
					allUsers={props.users}
					totalTickets={props.data?.length || 0}
				/>
			</div>
			<table>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column.key} style={column.headerStyles}>
								{column.header}
							</th>
						))}
						<th style={{ width: "10%" }}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{isFetching ? (
						<tr>
							<td colSpan={columns.length + 1}>
								<CircularLoading size={16} />
							</td>
						</tr>
					) : null}
					{!isFetching && (!data || data.length === 0) ? (
						<tr>
							<td colSpan={columns.length + 1}>
								No data to display.
							</td>
						</tr>
					) : null}
					{!isFetching &&
						formatData?.map((row, idx) => (
							<tr key={row["id"]}>
								{columns.map((column) => (
									<td
										key={`${row["id"]}-${column.key}`}
										style={{
											...column.styles,
											color:
												column.key === "completed"
													? RStatus?.[
															Number(
																data[idx]
																	?.completed
															)
													  ]?.styles?.color
													: "black",
										}}>
										{row[column.key as keyof typeof row]}
									</td>
								))}
								<td>
									<button
										className="buttonRedirect"
										onClick={() =>
											handleRedirect(row?.["id"])
										}
										disabled={isRedirecting}>
										{isRedirecting &&
										targetId === row?.["id"] ? (
											<CircularLoading size={16} />
										) : (
											"↗️"
										)}
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default DynamicTable;
