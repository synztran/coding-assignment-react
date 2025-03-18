import { optionsFilter } from "@acme/shared-constants";
import { TicketStatus } from "@acme/shared-models";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles.css";

interface IProps {
	selectedStatus: TicketStatus;
	setSelectedStatus: (status: TicketStatus) => void;
}

const Filter: React.FC<IProps> = (props) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { selectedStatus, setSelectedStatus } = props;

	const handleApplyFilter = () => {
		if (selectedStatus !== "") {
			searchParams.set("status", selectedStatus);
			navigate(`?${searchParams.toString()}`);
		} else {
			searchParams.delete("status");
			navigate(``);
		}
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedStatus(e.target.value as TicketStatus);
	};

	return (
		<div className="filterContaier">
			<select
				className="selectFilter"
				value={selectedStatus}
				onChange={handleOnChange}>
				{optionsFilter.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<button className="buttonApply" onClick={handleApplyFilter}>
				Apply Filter
			</button>
		</div>
	);
};

export default Filter;
