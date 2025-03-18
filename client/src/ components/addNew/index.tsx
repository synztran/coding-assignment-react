import { User } from "@acme/shared-models";
import { useTriggerRefetch } from "client/src/app/hooks/useTriggerRefetch";
import useToast, { EnumToastType } from "client/src/hooks/useToast";
import React, { FormEvent, useState } from "react";
import CircularLoading from "../loading";
import Modal from "../modal";
import "./styles.css";

interface IProps {
	totalTickets: number;
	allUsers: User[];
}

const AddNew: React.FC<IProps> = (props) => {
	const { allUsers, totalTickets } = props;
	const toast = useToast();
	const { incrementTrigger } = useTriggerRefetch();
	const [isOpen, setOpen] = useState(false);
	const [assigneeId, setAssigneeId] = useState<number | null>(null);
	const [errorMessage, setErrorMessage] = useState<{
		description: string;
		form: string;
	}>({
		description: "",
		form: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const handleToggleMoalda = () => {
		setOpen(!isOpen);
	};

	function handleFormData(
		event: React.FormEvent<HTMLFormElement>,
		formDataSetter?: React.Dispatch<
			React.SetStateAction<Record<string, string>>
		>,
		extraData: Record<string, any> = {}
	): Record<string, string> | null {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);
		const formValues: Record<string, string> = {};

		formData.forEach((value, key) => {
			if (typeof value === "string") {
				formValues[key] = value;
			}
		});

		const combinedData = { ...formValues, ...extraData };

		if (!combinedData["description"]) {
			setErrorMessage((prev) => ({
				...prev,
				description: "Description is required.",
			}));
			return null;
		} else {
			setErrorMessage((prev) => ({ ...prev, description: "" }));
		}

		if (formDataSetter) {
			formDataSetter(combinedData);
		}

		return combinedData;
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		setSubmitting(true);
		const submittedData = handleFormData(event);
		if (assigneeId !== null && isNaN(assigneeId)) {
			toast.showToast("Invalid assignee ID.", EnumToastType.ERROR, 3000);
			setSubmitting(false);
			return;
		}
		if (submittedData) {
			fetch(`/api/tickets`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...submittedData }),
			})
				.then((response) => {
					if (!response.ok) {
						setSubmitting(false);
						throw new Error("Failed to update ticket");
					}
					toast.showToast(
						"Ticket created",
						EnumToastType.SUCCESS,
						3000
					);
					// TODO: close modal after create success
					setOpen(false);
					incrementTrigger();
				})
				.catch((err) => {
					console.log("err", err);
					toast.showToast(
						"Ticket create fail",
						EnumToastType.ERROR,
						3000
					);
				});
		} else {
			toast.showToast("Ticket create fail", EnumToastType.ERROR, 3000);
			setErrorMessage((prev) => ({
				...prev,
				form: "Form is invalid. Please try again!",
			}));
		}
		setSubmitting(false);
	};

	return (
		<div>
			<button className="buttonAdd" onClick={handleToggleMoalda}>
				Add new ticket
			</button>
			<Modal
				isOpen={isOpen}
				onClose={submitting ? () => {} : handleToggleMoalda}>
				<div className="title">Create new ticket</div>
				<form onSubmit={handleSubmit}>
					<div className="formContainer">
						<div>
							<label htmlFor="itemName">Id:</label>&nbsp;
							<span className="ticketId">{totalTickets + 1}</span>
						</div>
						<div className="fieldBlock">
							<label htmlFor="itemName">Description:</label>
							<textarea
								id="description"
								name="description"
								className="textArea"
							/>
							{errorMessage.description ? (
								<p className="errorMessage">
									{errorMessage.description}
								</p>
							) : null}
						</div>
						<div className="fieldBlock">
							<label htmlFor="assignee">Assign To:</label>
							<div>
								<select
									id="assignee"
									value={assigneeId || ""}
									name="assignee"
									onChange={(e) =>
										setAssigneeId(parseInt(e.target.value))
									}>
									<option value="">Unassigned</option>
									{allUsers.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</select>
							</div>
						</div>
						{errorMessage.form ? (
							<p className="formErrorMessage">
								{errorMessage.form}
							</p>
						) : null}
						<div className="addContainer">
							<button disabled={submitting}>
								{submitting ? (
									<CircularLoading size={12} />
								) : (
									"Add"
								)}
							</button>
						</div>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AddNew;
