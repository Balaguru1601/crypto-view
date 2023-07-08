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

export const sortByName = (data: cryptoType[], type: "asc" | "dsc") => {
	const ret = data
		.sort((a, b) => {
			if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
			else if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
			return 0;
		})
		.slice(0);
	if (type === "asc") return ret;
	return ret.reverse();
};

export const sortByNumber = (
	data: cryptoType[],
	type: "asc" | "dsc",
	parameter: keyof cryptoType
) => {
	const ret = data.sort((a, b) => +a[parameter] - +b[parameter]).slice(0);
	if (type === "asc") return ret;
	return ret.reverse();
};

export const validateFloat = (value: string) => {
	return (
		/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value) ||
		value === "-" ||
		value === ""
	);
};

export const validatePositiveFloat = (value: string) => {
	return /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value) || value === "";
};

export const validateNumber = (value: string) => {
	return (+value <= 100 && +value > 0) || value === "";
};
