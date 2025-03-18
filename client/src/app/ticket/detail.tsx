import { RStatus } from "@acme/shared-constants";
import { Ticket, User } from "@acme/shared-models";
import CircularLoading from "client/src/ components/loading";
import useToast, { EnumToastType } from "client/src/hooks/useToast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTriggerRefetch } from "../hooks/useTriggerRefetch";
import "./styles.css";

const TicketDetail: React.FC = () => {
	const { id } = useParams();
	const toast = useToast();
	const navigate = useNavigate();
	const [ticket, setTicket] = useState<Ticket | null>(null);
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [allUsers, setAllUsers] = useState<User[]>([]); // Array of all users to assign to
	const { triggerRefetch, incrementTrigger, resetTrigger } =
		useTriggerRefetch();

	useEffect(() => {
		if (!id || isNaN(Number(id))) {
			setError("Invalid ticket ID.");
			return;
		}
		setLoading(true);
		// Fetch ticket details
		fetch(`/api/tickets/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch ticket");
				}
				return response.json();
			})
			.then((fetchedTicket) => {
				setTicket(fetchedTicket);
				setAssigneeId(fetchedTicket.assigneeId);
			})
			.catch((err) => {
				setError(err.message);
				toast.showToast(
					"Ticket fetched fail",
					EnumToastType.ERROR,
					3000
				);
			})
			.finally(() => setLoading(false));

		// Fetch users
		fetch("/api/users")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to load users");
				}
				return response.json();
			})
			.then((users) => {
				setAllUsers(users);
			})
			.catch((err) => {
				setError(err.message);
				toast.showToast(
					"Ticket fetched fail",
					EnumToastType.ERROR,
					3000
				);
			});

		return () => resetTrigger();
	}, [id, triggerRefetch]);

	const handleComplete = () => {
		fetch(`/api/tickets/${id}/complete`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...ticket, completed: true }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to update ticket");
				}
				toast.showToast(
					"Ticket marked as complete",
					EnumToastType.SUCCESS,
					3000
				);
				incrementTrigger();
			})
			.catch((err) => {
				setError(err.message);
				toast.showToast(
					"Ticket fetched fail",
					EnumToastType.ERROR,
					3000
				);
			});
	};

	const handleAssign = () => {
		if (!assigneeId || assigneeId === null) {
			// unassignee
			fetch(`/api/tickets/${id}/unassign`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...ticket,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to update ticket");
					}

					setTicket({
						...(ticket as Ticket),
						assigneeId: null,
					});
					incrementTrigger();
				})
				.catch((err) => {
					setError(err.message);
					toast.showToast(
						"Ticket unassignee fail",
						EnumToastType.ERROR,
						3000
					);
				});
		} else {
			fetch(`/api/tickets/${id}/assign/${assigneeId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...ticket,
					assigneeId: assigneeId || null,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Failed to update ticket");
					}

					if (assigneeId && assigneeId !== null) {
						setTicket({
							...(ticket as Ticket),
							assigneeId: assigneeId,
						});
					}
					incrementTrigger();
				})
				.catch((err) => {
					setError(err.message);
					toast.showToast(
						"Ticket assigned fail",
						EnumToastType.ERROR,
						3000
					);
				});
		}
	};

	const handleGoBack = () => {
		navigate("/");
	};

	if (loading)
		return (
			<div>
				<CircularLoading />
			</div>
		);
	if (error) return <p>Error: {error}</p>;
	if (!loading && !ticket) return <p>Ticket not found.</p>;

	return (
		<div>
			<div>
				<button className="buttonAssignee" onClick={handleGoBack}>
					Back
				</button>
				<h2>Ticket Details</h2>
			</div>
			<p>
				<strong>ID:</strong> {id || ticket?.id}
			</p>
			<p>
				<strong>Description:</strong>
				<div
					dangerouslySetInnerHTML={{
						__html: ticket?.description || "",
					}}
				/>
			</p>
			<p>
				<strong>Status:</strong>{" "}
				<span
					style={{
						...RStatus?.[Number(ticket?.completed)]?.styles,
						padding: "0.3rem 0.5rem",
						borderRadius: "0.5rem",
						color: "white",
						backgroundColor:
							RStatus?.[Number(ticket?.completed)]?.styles?.color,
					}}>
					{RStatus?.[Number(ticket?.completed)]?.label}
				</span>
			</p>

			{/* Complete Button */}
			{!ticket?.completed && (
				<button className="buttonAssignee" onClick={handleComplete}>
					Mark as Complete
				</button>
			)}

			{/* Assignee Dropdown */}
			<div className="assigneeContainer">
				<label htmlFor="assignee">Assign To:</label>
				<div>
					<select
						id="assignee"
						value={assigneeId || ""}
						onChange={(e) => {
							setAssigneeId(
								e.target.value !== "" ? +e.target.value : null
							);
						}}>
						<option value="">Unassigned</option>
						{allUsers.map((user) => (
							<option key={user.id} value={user.id}>
								{user.name}
							</option>
						))}
					</select>
					<button className="buttonAssignee" onClick={handleAssign}>
						Assign
					</button>
				</div>
			</div>
		</div>
	);
};

export default TicketDetail;
