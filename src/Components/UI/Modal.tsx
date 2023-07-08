import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";
import ModalOverlay from "./ModalOverlay";

const Modal = (props: {
	component: React.ReactNode;
	closeModal: () => void;
}) => {
	const bkdrpRef = useRef<Element | null>(null);
	const ovrlyRef = useRef<Element | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		bkdrpRef.current =
			document.querySelector<HTMLElement>("#backdrop-root");
		ovrlyRef.current = document.querySelector<HTMLElement>("#overlay-root");
		setMounted(true);
	}, []);

	return (
		<Fragment>
			{mounted && bkdrpRef.current
				? createPortal(<Backdrop />, bkdrpRef.current)
				: null}
			{mounted && ovrlyRef.current
				? createPortal(<ModalOverlay {...props} />, ovrlyRef.current)
				: null}
		</Fragment>
	);
};

export default Modal;
