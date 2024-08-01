export interface IItem {
	categoryId: string;
	children: IItemChildren | null;
	categoryValue: string;
}

export interface IItemChildren {
	[key: string]: IItem;
}

export type TCheckboxStatus = "checked" | "unchecked" | "indeterminate";
