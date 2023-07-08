import { useEffect, useState } from "react";
import classes from "./Table.module.css";
import SortBtn from "./SortBtn";
import axios from "axios";
import Modal from "./UI/Modal";
import { sortByNumber } from "./utilities/SortFunctions";

type Props = {};

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

const filterOptions = {
	changeMax: 0,
	changeMin: 0,
	rankMax: 100,
	rankMin: 1,
	priceMax: 0,
	priceMin: 0,
};

const filterData = {
	changeMax: 0,
	changeMin: 0,
	rankMax: 100,
	rankMin: 1,
	priceMax: 0,
	priceMin: 0,
};

const getInitialData = async () => {
	const data: cryptoType[] = (
		await axios.get("https://api.coinlore.net/api/tickers/")
	).data.data;
	filterOptions.changeMax = +sortByNumber(
		data,
		"dsc",
		"percent_change_24h"
	)[0].percent_change_24h;
	filterOptions.changeMin = +sortByNumber(
		data,
		"asc",
		"percent_change_24h"
	)[0].percent_change_24h;
	filterOptions.priceMin = +sortByNumber(data, "asc", "price_usd")[0]
		.price_usd;
	filterOptions.priceMax = +sortByNumber(data, "dsc", "price_usd")[0]
		.price_usd;
	return data;
};

const validateFloat = (value: string) => {
	return /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value) || value === "";
};

const validateNumber = (value: string) => {
	return (+value <= 100 && +value > 0) || value === "";
};

const ViewTable = (props: Props) => {
	const [cryptoData, setCryptoData] = useState<cryptoType[]>([]);
	const [gCryptoData, setGCryptoData] = useState<cryptoType[]>([]);
	const [loading, setLoading] = useState(true);
	const [highlight, setHighlight] = useState<keyof cryptoType | null>(null);
	const [pageCount, setPageCount] = useState(1);
	const [searchKey, setSearchKey] = useState<string>("");
	const [refresh, setRefresh] = useState(true);
	const [openFilter, setOpenFilter] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [derror, setDerror] = useState<string | null>(null);
	const [filterUsed, setFilterUsed] = useState(false);
	const [filterSelects, setFilterSelects] = useState<{
		changeMax: number;
		changeMin: number;
		rankMax: number;
		rankMin: number;
		priceMax: number;
		priceMin: number;
	}>({
		changeMax: 0,
		changeMin: 0,
		rankMax: 100,
		rankMin: 1,
		priceMax: 0,
		priceMin: 0,
	});
	const [filterLimits, setFilterLimits] = useState<{
		changeMax: number;
		changeMin: number;
		rankMax: number;
		rankMin: number;
		priceMax: number;
		priceMin: number;
	}>({
		changeMax: 0,
		changeMin: 0,
		rankMax: 100,
		rankMin: 1,
		priceMax: 0,
		priceMin: 0,
	});

	const validateFilterValues = () => {
		if (
			filterLimits.changeMax > filterLimits.changeMin &&
			filterLimits.priceMax > filterLimits.priceMin &&
			filterLimits.rankMax > filterLimits.rankMin
		)
			return true;
		return false;
	};

	const applyFilter = () => {
		const filteredResult = gCryptoData.filter(
			(d) =>
				filterSelects.changeMax >= +d.percent_change_24h &&
				filterSelects.changeMin <= +d.percent_change_24h &&
				filterSelects.priceMax >= +d.price_usd &&
				filterSelects.priceMin <= +d.price_usd &&
				filterSelects.rankMax >= d.rank &&
				filterSelects.rankMin <= d.rank
		);
		if (filteredResult.length === 0) setDerror("No values found!");
		setPageCount(1);
		setHighlight(null);
		setCryptoData(
			gCryptoData.filter(
				(d) =>
					filterSelects.changeMax >= +d.percent_change_24h &&
					filterSelects.changeMin <= +d.percent_change_24h &&
					filterSelects.priceMax >= +d.price_usd &&
					filterSelects.priceMin <= +d.price_usd &&
					filterSelects.rankMax >= d.rank &&
					filterSelects.rankMin <= d.rank
			)
		);
	};

	const filterComponent = (
		<div className={classes.filterWrapper}>
			{error && <p>{error}</p>}
			<span className={classes.inputWrapper}>
				<label htmlFor="">% Change(24h)</label>
				<span>
					<small>Min ({filterLimits.changeMin}):</small>
					<input
						type="number"
						min={filterLimits.changeMin}
						max={filterLimits.changeMax}
						onChange={(e) =>
							validateFloat(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								changeMin: +e.target.value,
							})
						}
						value={filterSelects.changeMin}
						step={0.001}
					/>
				</span>
				<span>
					<small>Max ({filterLimits.changeMax}):</small>
					<input
						type="number"
						min={filterLimits.changeMin}
						max={filterLimits.changeMax}
						onChange={(e) =>
							validateFloat(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								changeMax: +e.target.value,
							})
						}
						value={filterSelects.changeMax}
						step={0.001}
					/>
				</span>
			</span>
			<span className={classes.inputWrapper}>
				<label htmlFor="">Rank</label>
				<span>
					<small>Min ({filterLimits.rankMin}):</small>
					<input
						type="number"
						min={0}
						max={100}
						onChange={(e) =>
							validateNumber(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								rankMin: +e.target.value,
							})
						}
						value={filterSelects.rankMin}
						step={1}
					/>
				</span>
				<span>
					<small>Max ({filterLimits.rankMax}):</small>
					<input
						type="number"
						min={0}
						max={100}
						onChange={(e) =>
							validateNumber(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								rankMax: +e.target.value,
							})
						}
						value={filterSelects.rankMax}
						step={1}
					/>
				</span>
			</span>
			<span className={classes.inputWrapper}>
				<label htmlFor="">Price (USD)</label>
				<span>
					<small>Min ({filterLimits.priceMin}):</small>
					<input
						type="number"
						min={filterLimits.priceMin}
						max={filterLimits.priceMax}
						onChange={(e) =>
							validateFloat(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								priceMin: +e.target.value,
							})
						}
						value={filterSelects.priceMin}
						step={0.01}
					/>
				</span>
				<span>
					<small>Max ({filterLimits.priceMax}):</small>
					<input
						type="number"
						min={filterLimits.priceMin}
						max={filterLimits.priceMax}
						onChange={(e) =>
							validateFloat(e.target.value) &&
							setFilterSelects({
								...filterSelects,
								priceMax: +e.target.value,
							})
						}
						value={filterSelects.priceMax}
						step={0.01}
					/>
				</span>
			</span>
			<button
				onClick={() => {
					if (validateFilterValues()) {
						applyFilter();
						setOpenFilter(false);
						setFilterUsed(true);
					} else setError("Please enter valid filter values!");
				}}
			>
				Apply
			</button>
		</div>
	);

	useEffect(() => {
		if (refresh) {
			setHighlight(null);
			setLoading(true);
			try {
				getInitialData().then((data) => {
					setCryptoData(data);
					setGCryptoData(data);
					setFilterLimits({ ...filterOptions });
					setFilterSelects({ ...filterOptions });
					setPageCount(1);
					setRefresh(false);
					setLoading(false);
				});
				setDerror(null);
			} catch (e) {
				setDerror("Unable to fetch Data!");
			}
		}
	}, [refresh]);

	const maxPage = Math.ceil(cryptoData.length / 20);

	const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const term = event.target.value.trim();
		setDerror(null);
		if (term === "") setCryptoData(gCryptoData);
		else if (/^\d+$/.test(term)) {
			if (
				gCryptoData.filter((data) => data.id.startsWith(term))
					.length === 0
			)
				setDerror("No values found!");
			setCryptoData(
				gCryptoData.filter((data) => data.id.startsWith(term))
			);
		} else if (/^[a-zA-Z]+$/.test(term)) {
			if (
				gCryptoData.filter((data) => data.nameid.startsWith(term))
					.length === 0
			)
				setDerror("No values found!");
			setCryptoData(
				gCryptoData.filter((data) => data.nameid.startsWith(term))
			);
		}
		setSearchKey(term);
	};

	return (
		<div className={classes.tableWrapper}>
			{openFilter && (
				<Modal
					component={filterComponent}
					closeModal={() => setOpenFilter(false)}
				/>
			)}
			<h3 className={classes.heading}>Crypto View</h3>
			<header className={classes.captionBar}>
				<div className={classes.searchBar}>
					<input
						type="text"
						value={searchKey}
						placeholder="Search"
						onChange={searchHandler}
					/>
					<i className="bi bi-search"></i>
				</div>
				<div>
					<button
						className={classes.filterBtn}
						onClick={() => {
							setOpenFilter(true);
							setError(null);
						}}
					>
						Filter Options
					</button>
					{filterUsed && (
						<button
							className={classes.filterBtn}
							onClick={() => {
								setFilterSelects({ ...filterLimits });
								setDerror(null);
								setCryptoData(gCryptoData);
								setHighlight(null);
								setPageCount(1);
								setFilterUsed(false);
							}}
						>
							Clear Filter
						</button>
					)}
					<button
						className={classes.refreshBtn}
						onClick={() => {
							setRefresh(true);
							setLoading(true);
							setFilterUsed(false);
						}}
					>
						Refresh data <i className="bi bi-arrow-clockwise"></i>
					</button>
				</div>
			</header>
			{loading && <p>Loading...</p>}
			{derror && <p>{derror}</p>}
			{!loading && !derror && (
				<>
					<table className={classes.table}>
						<tbody>
							<tr>
								<th>S.no</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="id"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Id
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="string"
										field="name"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Name
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="rank"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Rank
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="price_usd"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Price (USD)
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="percent_change_24h"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										% Change(24h)
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="price_btc"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Price (BTC)
									</SortBtn>
								</th>
								<th>
									<SortBtn
										setter={setCryptoData}
										type="number"
										field="market_cap_usd"
										data={cryptoData}
										setField={setHighlight}
										selected={highlight}
									>
										Market cap
									</SortBtn>
								</th>
							</tr>
							{!loading &&
								cryptoData
									.slice(
										(pageCount - 1) * 20,
										Math.min(
											pageCount * 20,
											cryptoData.length
										)
									)
									.map((item, index) => (
										<tr key={index + (pageCount - 1) * 20}>
											<td>
												{index +
													1 +
													(pageCount - 1) * 20}
											</td>
											<td
												className={
													highlight === "id"
														? classes.highlight
														: ""
												}
											>
												{item.id}
											</td>
											<td
												className={
													highlight === "name"
														? classes.highlight
														: ""
												}
											>
												{item.name}
											</td>
											<td
												className={
													highlight === "rank"
														? classes.highlight
														: ""
												}
											>
												{item.rank}
											</td>
											<td
												className={
													highlight === "price_usd"
														? classes.highlight
														: ""
												}
											>
												{item.price_usd}
											</td>
											<td
												className={
													highlight ===
													"percent_change_24h"
														? classes.highlight
														: ""
												}
											>
												<span
													className={
														+item.percent_change_24h >
														0
															? classes.upBadge
															: classes.downBadge
													}
												>
													{/* {item.percent_change_24h !== 0 &&
									item.percent_change_24h < 0 ? (
										<i className="bi bi-arrow-down-right"></i>
									) : (
										<i className="bi bi-arrow-up-right"></i>
                                    )} */}
													• {item.percent_change_24h}
												</span>
											</td>
											<td
												className={
													highlight === "price_btc"
														? classes.highlight
														: ""
												}
											>
												{item.price_btc}
											</td>
											<td
												className={
													highlight ===
													"market_cap_usd"
														? classes.highlight
														: ""
												}
											>
												{item.market_cap_usd}
											</td>
										</tr>
									))}
						</tbody>
					</table>
					<div className={classes.pagination}>
						<button
							className={classes.paginationBtn}
							onClick={() => setPageCount(pageCount - 1)}
							disabled={!(pageCount > 1)}
						>
							<i className="bi bi-caret-left-fill"></i>
						</button>
						{pageCount}/{maxPage}
						<button
							className={classes.paginationBtn}
							onClick={() => setPageCount(pageCount + 1)}
							disabled={!(pageCount < maxPage)}
						>
							<i className="bi bi-caret-right-fill"></i>
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default ViewTable;
