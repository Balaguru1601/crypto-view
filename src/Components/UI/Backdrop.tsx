import classes from "./UI.module.css";

const Backdrop = (props: { children?: React.ReactNode }) => {
	return <div className={classes.backdrop}></div>;
};

export default Backdrop;
