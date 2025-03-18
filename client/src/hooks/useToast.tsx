import { useEffect, useState } from "react";

interface IToast {
	message: string;
	type: string;
	duration: number;
}

export enum EnumToastType {
	INFO = "info",
	SUCCESS = "success",
	ERROR = "error",
}

function useToast() {
	const [toast, setToast] = useState<IToast | null>(null);

	const showToast = (
		message: string,
		type: EnumToastType,
		duration: number
	) => {
		if (duration <= 0) {
			console.error("Duration must be a positive number.");
			return;
		}
		setToast({ message, type, duration });
	};

	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => {
				setToast(null);
			}, toast.duration);

			return () => clearTimeout(timer);
		}

		return;
	}, [toast]);

	const ToastComponent = () => {
		if (!toast) {
			return null;
		}

		return <div className={`toast ${toast.type}`}>{toast.message}</div>;
	};

	return { showToast, ToastComponent };
}

export default useToast;
