import { useCallback, useState } from "react";
import "./App.css";
import SelectCategoryDropDown from "./components/SelectCategoryDropDown";
import { selectConfig } from "./data/selectConfig";

function App() {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const handleChange = useCallback((val: string[]) => {
		setSelectedCategories(val);
	}, []);

	return (
		<div className="p-12">
			<SelectCategoryDropDown
				onChange={handleChange}
				selectedCategories={selectedCategories}
				categories={selectConfig}
			/>
		</div>
	);
}

export default App;
