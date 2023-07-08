import { useEffect, useState } from "react";
import classes from "./btn.module.css";
import { sortByName, sortByNumber } from "./utilities/SortFunctions";

interface cryptoType {
	id: string;
	symbol: string;
	name: string;
	nameid: string;
	rank: number;
	price_usd: string;
	percent_change_24h: string;
	percent_change_1h: string;
	percent_change_7d: string;
	price_btc: string;
	market_cap_usd: string;
	volume24: number;
	volume24a: number;
	csupply: string;
	tsupply: string;
	msupply: string;
}

type Props = {
	sortFn?: () => void;
	setter: (data: cryptoType[]) => void;
	type: "string" | "number";
	field: keyof cryptoType;
	data: cryptoType[];
	setField: (field: keyof cryptoType) => void;
	selected: keyof cryptoType | null;
	children: React.ReactNode;
};

const SortBtn = (props: Props) => {
	const [up, setUp] = useState<boolean | null>(null);

	useEffect(() => {
		if (props.selected !== props.field) setUp(null);
	}, [props.selected]);

	const clickHandler = () => {
		if (up && props.type === "number")
			props.setter(sortByNumber(props.data, "dsc", props.field));
		else if (up && props.type === "string")
			props.setter(sortByName(props.data, "dsc"));
		else if (!up && props.type === "number")
			props.setter(sortByNumber(props.data, "asc", props.field));
		else props.setter(sortByName(props.data, "asc"));
		setUp((prev) => !prev);
		props.setField(props.field);
	};

	const upSvg: React.ReactNode = up ? (
		<i
			className="bi bi-arrow-down-short"
			style={{ fontSize: "1.2rem" }}
		></i>
	) : (
		<i className="bi bi-arrow-up-short" style={{ fontSize: "1.2rem" }}></i>
	);

	return (
		<button className={classes.sortBtn} onClick={clickHandler}>
			{props.children}
			{up !== null ? upSvg : "  "}
		</button>
	);
};

export default SortBtn;
