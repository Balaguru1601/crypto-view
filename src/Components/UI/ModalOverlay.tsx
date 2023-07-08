import classes from "./UI.module.css";

type Props = {
	closeModal: () => void;
	component: React.ReactNode;
};

const ModalOverlay = (props: Props) => {
	return (
		<div className={classes.modalOverlay}>
			{props.component}
			<button onClick={props.closeModal} className={classes.closeBtn}>
				X
			</button>
		</div>
	);
};

export default ModalOverlay;
