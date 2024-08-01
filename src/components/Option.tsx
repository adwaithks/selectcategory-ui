import { Checkbox } from "./ui/checkbox";
import { IItem, TCheckboxStatus } from "@/types/selectcategorydropdown.types";

interface IProps {
	handleSetStatusMap: (val: Record<string, TCheckboxStatus>) => void;
	statusMap: Record<string, TCheckboxStatus>;
	obj: IItem;
	categories: { [key: string]: IItem };
	selectedCategories: string[];
	onChange: (vals: string[]) => void;
}

const Option: React.FC<IProps> = ({
	categories,
	obj,
	onChange,
	selectedCategories,
	handleSetStatusMap,
	statusMap,
}) => {
	// start from the current node, get all the children categoryIds recursively
	// returns category Ids of all the children, except for the current node
	const getChildren = (): string[] => {
		const result: string[] = [];

		function recursion(childrens: IItem[]) {
			for (const child of childrens) {
				result.push(child.categoryId);
				if (child.children) {
					recursion(Object.values(child.children));
				}
			}
		}

		if (!obj.children) return [];

		recursion(Object.values(obj.children));

		return result;
	};

	// recurse down the categories and find the checkbox i checked,
	// update the states, recurse back to top, again update states on the way back also
	// returns the new status map after all the updations
	const updateParentsOnUnCheck = () => {
		const mapCopy = { ...statusMap };

		const recursion = (children: IItem[]) => {
			for (const child of children) {
				// found the option i just checked
				if (child.categoryId === obj.categoryId) {
					const temp = getChildren();
					// mark all the children
					temp.forEach((t) => {
						mapCopy[t] = "unchecked";
					});
					// mark the current node
					mapCopy[child.categoryId] = "unchecked";
					return true;
				}

				if (child.children) {
					const values = Object.values(child.children).filter(
						(c) => !c.categoryValue.endsWith("diffnode")
					);
					const ans = recursion(values);
					// if we have found the node we are looking for, then check for conditions to determine
					// parent checkbox states and then keep backracking up to the root
					if (ans) {
						const someMarkedChilds = values.some(
							(c) =>
								mapCopy[c.categoryId] &&
								mapCopy[c.categoryId] === "checked"
						);
						const someMarkedIndeterminate = values.some(
							(c) =>
								mapCopy[c.categoryId] &&
								mapCopy[c.categoryId] === "indeterminate"
						);

						if (someMarkedChilds) {
							mapCopy[child.categoryId] = "indeterminate";
						} else if (someMarkedIndeterminate) {
							mapCopy[child.categoryId] = "indeterminate";
						} else {
							mapCopy[child.categoryId] = "unchecked";
						}

						return true;
					}
				}
			}

			return false;
		};

		recursion(
			Object.values(categories).filter(
				(c) => !c.categoryValue.endsWith("diffnode")
			)
		);
		return mapCopy;
	};

	// recurse down the categories and find the checkbox i checked,
	// update the states, recurse back to top, again update states on the way back also
	// returns the new status map after all the updations
	const updateParentsOnCheck = () => {
		const mapCopy = { ...statusMap };

		const recursion = (children: IItem[]) => {
			for (const child of children) {
				// found the option i just checked
				if (child.categoryId === obj.categoryId) {
					const temp = getChildren();
					// mark all the children
					temp.forEach((t) => {
						mapCopy[t] = "checked";
					});
					// mark the current node
					mapCopy[child.categoryId] = "checked";
					return true;
				}

				if (child.children) {
					const values = Object.values(child.children).filter(
						(c) => !c.categoryValue.endsWith("diffnode")
					);
					const ans = recursion(values);

					// if we have found the node we are looking for, then check for conditions to determine
					// parent checkbox states and then keep backracking up to the root
					if (ans) {
						const allMarkedChilds = values.every(
							(c) =>
								mapCopy[c.categoryId] &&
								mapCopy[c.categoryId] === "checked"
						);
						const someMarkedChilds = values.some(
							(c) =>
								mapCopy[c.categoryId] &&
								mapCopy[c.categoryId] === "checked"
						);
						const anyIndeterminate = values.some(
							(c) =>
								mapCopy[c.categoryId] &&
								mapCopy[c.categoryId] === "indeterminate"
						);

						if (allMarkedChilds) {
							mapCopy[child.categoryId] = "checked";
						} else if (someMarkedChilds || anyIndeterminate) {
							mapCopy[child.categoryId] = "indeterminate";
						}

						return true;
					}
				}
			}
			return false;
		};

		recursion(
			Object.values(categories).filter(
				(c) => !c.categoryValue.endsWith("diffnode")
			)
		);
		return mapCopy;
	};

	// determine whether current node is checked, unchecked or in indeterminate state
	const isChecked = () => {
		if (!(obj.categoryId in statusMap)) return false;
		if (statusMap[obj.categoryId] === "checked") return true;
		if (statusMap[obj.categoryId] === "unchecked") return false;
		return "indeterminate";
	};

	const handleOnCheckChange = () => {
		const isCheckingBox = !selectedCategories.includes(obj.categoryId);

		// just checked this node
		if (isCheckingBox) {
			const newStatus = updateParentsOnCheck();
			const filtered = Object.entries(newStatus)
				.filter(([, value]) => value === "checked")
				.map(([key]) => key);

			onChange(filtered);
			handleSetStatusMap(newStatus);
		} else {
			// just unchecked this node
			const newStatus = updateParentsOnUnCheck();
			const filtered = Object.entries(newStatus)
				.filter(([, value]) => value === "checked")
				.map(([key]) => key);
			onChange(filtered);
			handleSetStatusMap(newStatus);
		}
	};

	return (
		<div className="hover:bg-gray-200/50 px-4 rounded-md p-1 flex flex-row items-center">
			<Checkbox
				checked={isChecked()}
				onCheckedChange={handleOnCheckChange}
				id={obj.categoryId}
				className="mr-2"
			/>

			<label
				htmlFor={obj.categoryId}
				className="cursor-pointer flex items-center"
			>
				{obj.categoryValue}
			</label>
		</div>
	);
};

export default Option;
