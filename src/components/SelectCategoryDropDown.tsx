import { useCallback, useMemo, useState } from "react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { IItem, TCheckboxStatus } from "@/types/selectcategorydropdown.types";
import { idsToNameMap } from "@/data/selectConfig";

import SelectCategoryOptions from "./SelectCategoryOptions";

interface IProps {
	categories: { [key: string]: IItem };
	onChange: (val: string[]) => void;
	selectedCategories: string[];
}

const SelectCategoryDropDown: React.FC<IProps> = ({
	categories,
	onChange,
	selectedCategories,
}) => {
	// keep track of category ids and their check box statuses
	// if there is already selected categories, use it as initial state
	const [statusMap, setStatusMap] = useState<Record<string, TCheckboxStatus>>(
		selectedCategories.reduce<Record<string, TCheckboxStatus>>(
			(acc, key) => {
				acc[key] = "checked";
				return acc;
			},
			{}
		)
	);

	const handleSetStatusMap = useCallback(
		(val: Record<string, TCheckboxStatus>) => {
			setStatusMap(val);
		},
		[]
	);

	// get currently selected categories as a string
	const statusValue = useMemo(() => {
		return Object.entries(statusMap)
			.filter(([, val]) => val === "checked")
			.map(([key]) => idsToNameMap[key])
			.join(", ");
	}, [statusMap]);

	return (
		<Select>
			<SelectTrigger className="w-[180px] overflow-hidden">
				<pre>
					{statusValue.length ? statusValue : "Select Categories"}
				</pre>
			</SelectTrigger>
			<SelectContent>
				<SelectCategoryOptions
					onChange={onChange}
					handleSetStatusMap={handleSetStatusMap}
					statusMap={statusMap}
					selectedCategories={selectedCategories}
					categories={categories}
				/>
			</SelectContent>
		</Select>
	);
};

export default SelectCategoryDropDown;
