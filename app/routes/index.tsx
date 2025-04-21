// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

// Example 1: Component with useMemo for filtering and sorting products
function ProductList() {
	const [products, setProducts] = useState([
		{ id: 1, name: "Laptop", price: 1200, category: "electronics" },
		{ id: 2, name: "Headphones", price: 100, category: "electronics" },
		{ id: 3, name: "Book", price: 15, category: "books" },
		{ id: 4, name: "Phone", price: 800, category: "electronics" },
		{ id: 5, name: "Desk", price: 350, category: "furniture" },
	]);
	const [minPrice, setMinPrice] = useState(50);
	const [selectedCategory, setSelectedCategory] = useState("electronics");

	// Using useMemo to avoid re-filtering and re-sorting on every render
	const filteredAndSortedProducts = useMemo(() => {
		console.log("Calculating filtered and sorted products...");
		return products
			.filter(
				(product) =>
					product.price > minPrice && product.category === selectedCategory
			)
			.sort((a, b) => a.price - b.price);
	}, [products, minPrice, selectedCategory]);

	return (
		<div className="mt-6 p-4 border rounded shadow">
			<h2 className="text-xl font-bold">Product Filtering Example (useMemo)</h2>
			<div className="mb-4">
				<label className="block mb-2">
					Minimum Price: {minPrice}
					<input
						type="range"
						min="0"
						max="1000"
						value={minPrice}
						onChange={(e) => setMinPrice(Number(e.target.value))}
						className="ml-2"
					/>
				</label>
				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className="p-2 border rounded"
				>
					<option value="electronics">Electronics</option>
					<option value="books">Books</option>
					<option value="furniture">Furniture</option>
				</select>
			</div>
			<div>
				<h3 className="font-bold">Filtered Products:</h3>
				<ul className="list-disc pl-5">
					{filteredAndSortedProducts.map((product) => (
						<li key={product.id}>
							{product.name} - ${product.price}
						</li>
					))}
				</ul>
				<p className="mt-2 text-sm text-gray-600">
					Showing {filteredAndSortedProducts.length} of {products.length}{" "}
					products
				</p>
			</div>
		</div>
	);
}

// Example 2: Component with useMemo for data transformation
function ChartDataTransformer() {
	const [salesData, setSalesData] = useState([
		{ id: 1, date: "2023-01-15", revenue: 5200 },
		{ id: 2, date: "2023-02-15", revenue: 4800 },
		{ id: 3, date: "2023-03-15", revenue: 6100 },
		{ id: 4, date: "2023-04-15", revenue: 5700 },
		{ id: 5, date: "2023-05-15", revenue: 7200 },
	]);
	const [threshold, setThreshold] = useState(5500);

	// Using useMemo to transform data for chart display
	const chartData = useMemo(() => {
		console.log("Transforming sales data for chart...");
		return salesData.map((item) => ({
			x: new Date(item.date).toLocaleDateString(),
			y: item.revenue,
			color: item.revenue > threshold ? "green" : "red",
		}));
	}, [salesData, threshold]);

	return (
		<div className="mt-6 p-4 border rounded shadow">
			<h2 className="text-xl font-bold">
				Chart Data Transformation Example (useMemo)
			</h2>
			<div className="mb-4">
				<label className="block mb-2">
					Revenue Threshold: ${threshold}
					<input
						type="range"
						min="4000"
						max="8000"
						step="100"
						value={threshold}
						onChange={(e) => setThreshold(Number(e.target.value))}
						className="ml-2"
					/>
				</label>
			</div>
			<div>
				<h3 className="font-bold">Transformed Chart Data:</h3>
				<ul className="list-disc pl-5">
					{chartData.map((point, index) => (
						<li key={index} style={{ color: point.color }}>
							{point.x}: ${point.y}{" "}
							{point.y > threshold ? "(Above threshold)" : "(Below threshold)"}
						</li>
					))}
				</ul>
				<div className="mt-4 p-2 bg-gray-100 rounded">
					<p className="text-sm font-mono">
						{JSON.stringify(chartData, null, 2)}
					</p>
				</div>
			</div>
		</div>
	);
}

function Home() {
	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">useMemo Examples</h1>

			{/* Include the two useMemo example components */}
			<ProductList />
			<ChartDataTransformer />
		</div>
	);
}
