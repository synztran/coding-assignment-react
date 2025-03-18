import "./styles.css";

interface IProps {
	text: string;
	children: React.ReactNode;
}

function Tooltip(props: IProps) {
	const { text, children } = props;
	return (
		<div className="tooltip">
			{children}
			<span className="tooltiptext">{text}</span>
		</div>
	);
}

export default Tooltip;
