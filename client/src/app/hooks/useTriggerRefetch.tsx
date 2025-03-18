import React, { createContext, useContext, useState } from "react";

type TriggerRefetchContextType = {
	triggerRefetch: number;
	incrementTrigger: () => void;
	resetTrigger: () => void;
};

const TriggerRefetchContext = createContext<
	TriggerRefetchContextType | undefined
>(undefined);

export const TriggerRefetchProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [triggerRefetch, setTriggerRefetch] = useState(0);

	const incrementTrigger = () => setTriggerRefetch((prev) => prev + 1);
	const resetTrigger = () => setTriggerRefetch(0);

	return (
		<TriggerRefetchContext.Provider
			value={{ triggerRefetch, incrementTrigger, resetTrigger }}>
			{children}
		</TriggerRefetchContext.Provider>
	);
};

export const useTriggerRefetch = (): TriggerRefetchContextType => {
	const context = useContext(TriggerRefetchContext);
	if (!context) {
		throw new Error(
			"useTriggerRefetch must be used within a TriggerRefetchProvider"
		);
	}
	return context;
};
