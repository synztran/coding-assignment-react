import "./styles.css";

function CircularLoading({ size = 40 }) {
	return (
		<div className="loading-container">
			<div className="loader" style={{ width: size, height: size }} />
		</div>
	);
}

export default CircularLoading;
