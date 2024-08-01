import { IItem, TCheckboxStatus } from "@/types/selectcategorydropdown.types";
import React from "react";
import Option from "./Option";

interface IProps {
	categories: { [key: string]: IItem };
	onChange: (val: string[]) => void;
	handleSetStatusMap: (val: Record<string, TCheckboxStatus>) => void;
	statusMap: Record<string, TCheckboxStatus>;
	selectedCategories: string[];
	categoryChildren?: IItem | null;
	depth?: number;
}

const SelectCategoryOptions: React.FC<IProps> = ({
	categories, // original full categories maintained as it is
	onChange,
	statusMap,
	handleSetStatusMap,
	selectedCategories,
	categoryChildren = null, // used for rendering the children categories
	depth = 0,
}) => {
	return (
		<ul className="w-[100%] list-none">
			{Object.values(categoryChildren || categories).map((obj, idx) => {
				if (obj.categoryValue.toLowerCase().endsWith("_diffnode"))
					return null;

				return (
					<ul
						key={idx}
						style={{
							marginLeft: depth * 15,
						}}
					>
						<Option
							onChange={onChange}
							statusMap={statusMap}
							handleSetStatusMap={handleSetStatusMap}
							categories={categories}
							selectedCategories={selectedCategories}
							obj={obj}
						/>
						{obj.children ? (
							<SelectCategoryOptions
								statusMap={statusMap}
								handleSetStatusMap={handleSetStatusMap}
								categoryChildren={obj.children}
								categories={categories}
								selectedCategories={selectedCategories}
								onChange={onChange}
								depth={depth + 1}
							/>
						) : null}
					</ul>
				);
			})}
		</ul>
	);
};

export default SelectCategoryOptions;
