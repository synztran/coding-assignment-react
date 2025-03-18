import { useEffect, useRef } from "react";
import "./styles.css";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: IProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	if (typeof onClose !== "function") {
		console.error("onClose must be a valid function.");
		return null;
	}

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
			document.body.style.overflow = "hidden";
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.body.style.overflow = "auto";
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.body.style.overflow = "auto";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modalOverlay">
			<div className="modalContent" ref={modalRef}>
				<button className="modalClose" onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
}

export default Modal;
