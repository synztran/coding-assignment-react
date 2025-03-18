import { Route, Routes } from "react-router-dom";

import styles from "./app.module.css";
import { TriggerRefetchProvider } from "./hooks/useTriggerRefetch";
import TicketDetail from "./ticket/detail";
import Tickets from "./tickets/tickets";

const App = () => {
	return (
		<div className={styles["app"]}>
			<h1>Ticketing App</h1>
			<TriggerRefetchProvider>
				<Routes>
					<Route path="/" element={<Tickets />} />
					<Route path="/:id" element={<TicketDetail />} />
				</Routes>
			</TriggerRefetchProvider>
		</div>
	);
};

export default App;
