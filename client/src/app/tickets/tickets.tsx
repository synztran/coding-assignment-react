import { columns } from "@acme/shared-constants";
import { Ticket, User } from "@acme/shared-models";
import DynamicTable from "client/src/ components/table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTriggerRefetch } from "../hooks/useTriggerRefetch";
import styles from "./tickets.module.css";

export function Tickets() {
	const [searchParams] = useSearchParams();
	const filterStatus = searchParams.get("status");
	const [tickets, setTickets] = useState([] as Ticket[]);
	const [users, setUsers] = useState([] as User[]);
	const { triggerRefetch, resetTrigger } = useTriggerRefetch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		async function fetchTickets() {
			const query =
				filterStatus !== null ? `?completed=${filterStatus}` : "";
			const data = await fetch(`/api/tickets${query}`).then((res) =>
				res.json()
			);
			setTickets(data);
			setLoading(false);
		}

		async function fetchUsers() {
			const data = await fetch("/api/users").then((res) => res.json());
			setUsers(data);
		}

		fetchTickets();
		fetchUsers();

		return () => resetTrigger();
	}, [filterStatus, triggerRefetch]);

	const mapUsers = useMemo(() => {
		if (!users || users.length === 0) {
			return {};
		}

		return users.reduce((acc: { [key: number]: string }, user) => {
			acc[user.id] = user.name;
			return acc;
		}, {});
	}, [users]);

	return (
		<div className={styles["tickets"]}>
			<DynamicTable
				columns={columns}
				data={tickets || []}
				users={users}
				mapUsers={mapUsers}
				isFetching={loading}
			/>
		</div>
	);
}

export default Tickets;
