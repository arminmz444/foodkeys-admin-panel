import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

function AdditionalHeader() {
	const [ranking, setRanking] = useState("");
	const [combinedRanking, setCombinedRanking] = useState("");
	const handleChange = (event) => {
		setRanking(event.target.value);
	};
	const handleChangeCombined = (event) => {
		setCombinedRanking(event.target.value);
	};
	return (
		<>
			<FormControl sx={{ m: 1, minWidth: 100 }}>
				<InputLabel id="rankingSelect">رتبه</InputLabel>
				<Select
					labelId="rankingSelect"
					id="rankingSelect1"
					value={ranking}
					label="رتبه"
					onChange={handleChange}
				>
					<MenuItem value={0}>0</MenuItem>
					<MenuItem value={1}>1</MenuItem>
					<MenuItem value={2}>2</MenuItem>
					<MenuItem value={3}>3</MenuItem>
					<MenuItem value={4}>4</MenuItem>
					<MenuItem value={5}>5</MenuItem>
				</Select>
			</FormControl>
			<FormControl sx={{ m: 1, minWidth: 100 }}>
				<InputLabel id="combinedRankingSelect">رتبه ترکیبی</InputLabel>
				<Select
					labelId="combinedRankingSelect"
					id="combinedRankingSelect1"
					value={combinedRanking}
					label="رتبه ترکیبی"
					onChange={handleChangeCombined}
				>
					{new Array(100).fill(1).map((item, itemIndex) => (
						<MenuItem key={itemIndex} value={itemIndex}>
							{itemIndex + 1}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl sx={{ m: 1, minWidth: 100 }}>
				<InputLabel id="rankingSelect">وضعیت</InputLabel>
				<Select
					labelId="rankingSelect"
					id="rankingSelect1"
					value={ranking}
					label="وضعیت"
					onChange={handleChange}
				>
					<MenuItem value={0}>جدید</MenuItem>
					<MenuItem value={1}>تأیید شده</MenuItem>
					<MenuItem value={2}>تأیید و انتشار</MenuItem>
					<MenuItem value={3}>آرشیو اصلاح</MenuItem>
					<MenuItem value={4}>آرشیو حذف</MenuItem>
				</Select>
			</FormControl>
		</>
	);
}

export default AdditionalHeader;
