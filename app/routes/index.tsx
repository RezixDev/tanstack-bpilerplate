// app/routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

// Wyszukiwarka produktów - komponent nadrzędny
function Dashboard() {
	// Globalny stan aplikacji, który zmienia się często
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isLoading, setIsLoading] = useState(false);
	const [notifications, setNotifications] = useState<
		{ id: number; message: string }[]
	>([]);

	// Symulacja powiadomień przychodzących co 5 sekund
	useEffect(() => {
		const interval = setInterval(() => {
			const newNotification = {
				id: Date.now(),
				message: `Nowe powiadomienie o ${new Date().toLocaleTimeString()}`,
			};
			setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	// Symulacja opóźnienia ładowania przy zmianie kategorii
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 500));
			setIsLoading(false);
		};
		loadData();
	}, [selectedCategory]);

	// Funkcja obsługująca wyszukiwanie
	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<header className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Panel produktów</h1>
				<NotificationBell count={notifications.length} />
			</header>

			<div className="mb-6 flex space-x-4">
				<input
					type="text"
					value={searchQuery}
					onChange={handleSearch}
					placeholder="Szukaj produktów..."
					className="p-2 border rounded flex-grow"
				/>

				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className="p-2 border rounded"
				>
					<option value="all">Wszystkie kategorie</option>
					<option value="electronics">Elektronika</option>
					<option value="books">Książki</option>
					<option value="furniture">Meble</option>
				</select>
			</div>

			{isLoading ? (
				<div className="text-center py-10">Ładowanie...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Zauważ, że przekazujemy searchQuery do każdego komponentu */}
					<ProductListWithMemo
						category={selectedCategory}
						searchQuery={searchQuery}
					/>
					<ProductStatsWithoutMemo
						category={selectedCategory}
						searchQuery={searchQuery}
					/>
				</div>
			)}

			<div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
				<h2 className="text-lg font-bold mb-2">
					Typowe źródła re-renderów w React:
				</h2>
				<ol className="list-decimal pl-5">
					<li>
						<strong>Częste aktualizacje stanu:</strong> Wpisywanie w polu
						wyszukiwania aktualizuje <code>searchQuery</code> przy każdym
						wciśnięciu klawisza.
					</li>
					<li>
						<strong>Zdarzenia czasowe:</strong> Powiadomienia dodawane co 5
						sekund powodują re-render komponentów nadrzędnych.
					</li>
					<li>
						<strong>Komunikacja z API:</strong> Stan ładowania zmienia się
						podczas pobierania danych (symulowane przy zmianie kategorii).
					</li>
					<li>
						<strong>Propagacja propsów:</strong> Zmiana <code>searchQuery</code>{" "}
						powoduje re-render wszystkich komponentów potomnych, które otrzymują
						tę wartość jako props.
					</li>
				</ol>
				<p className="mt-4">
					Otwórz konsolę przeglądarki i obserwuj, jak zmienia się częstotliwość
					wywoływania funkcji w zależności od tego, czy używamy useMemo, czy
					nie.
				</p>
			</div>
		</div>
	);
}

// Komponent powiadomień - re-renderuje się przy każdej zmianie liczby powiadomień
function NotificationBell({ count }) {
	console.log("Renderowanie komponentu NotificationBell");
	return (
		<div className="relative">
			<span className="p-2 bg-gray-100 rounded-full">🔔</span>
			{count > 0 && (
				<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{count}
				</span>
			)}
		</div>
	);
}

// Lista produktów Z useMemo - optymalizacja filtrowania
function ProductListWithMemo({ category, searchQuery }) {
	const products = [
		{ id: 1, name: "Laptop Dell XPS", price: 5200, category: "electronics" },
		{ id: 2, name: "Słuchawki Sony", price: 800, category: "electronics" },
		{ id: 3, name: "Książka 'React w praktyce'", price: 89, category: "books" },
		{ id: 4, name: "Smartfon Samsung", price: 2800, category: "electronics" },
		{ id: 5, name: "Biurko ergonomiczne", price: 1200, category: "furniture" },
		{ id: 6, name: "Krzesło biurowe", price: 950, category: "furniture" },
		{
			id: 7,
			name: "Klawiatura mechaniczna",
			price: 450,
			category: "electronics",
		},
		{ id: 8, name: "JavaScript - przewodnik", price: 120, category: "books" },
	];

	// Zliczanie renderów - w prawdziwej aplikacji tego nie byłoby
	const renderCount = useRef(0);
	useEffect(() => {
		renderCount.current += 1;
		console.log(`ProductListWithMemo - render #${renderCount.current}`);
	});

	// Używamy useMemo do filtrowania - obliczenia wykonają się tylko przy zmianie category lub searchQuery
	const filteredProducts = useMemo(() => {
		console.log("Filtrowanie produktów Z USEMEMO...");

		// Symulacja złożonego filtrowania
		return products
			.filter((product) => {
				// Filtruj po kategorii
				if (category !== "all" && product.category !== category) {
					return false;
				}

				// Filtruj po zapytaniu wyszukiwania
				if (
					searchQuery &&
					!product.name.toLowerCase().includes(searchQuery.toLowerCase())
				) {
					return false;
				}

				return true;
			})
			.sort((a, b) => a.price - b.price);
	}, [category, searchQuery]);

	return (
		<div className="border rounded p-4">
			<h2 className="text-xl font-bold mb-3">Lista produktów (z useMemo)</h2>
			<p className="mb-2 text-sm">
				Znaleziono: {filteredProducts.length} produktów
			</p>

			<ul className="divide-y">
				{filteredProducts.map((product) => (
					<li key={product.id} className="py-2">
						<div className="font-medium">{product.name}</div>
						<div className="text-sm text-gray-600">
							{product.price} zł - {product.category}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

// Statystyki produktów BEZ useMemo - nieoptymalizowane
function ProductStatsWithoutMemo({ category, searchQuery }) {
	const products = [
		{ id: 1, name: "Laptop Dell XPS", price: 5200, category: "electronics" },
		{ id: 2, name: "Słuchawki Sony", price: 800, category: "electronics" },
		{ id: 3, name: "Książka 'React w praktyce'", price: 89, category: "books" },
		{ id: 4, name: "Smartfon Samsung", price: 2800, category: "electronics" },
		{ id: 5, name: "Biurko ergonomiczne", price: 1200, category: "furniture" },
		{ id: 6, name: "Krzesło biurowe", price: 950, category: "furniture" },
		{
			id: 7,
			name: "Klawiatura mechaniczna",
			price: 450,
			category: "electronics",
		},
		{ id: 8, name: "JavaScript - przewodnik", price: 120, category: "books" },
	];

	// Zliczanie renderów - w prawdziwej aplikacji tego nie byłoby
	const renderCount = useRef(0);
	useEffect(() => {
		renderCount.current += 1;
		console.log(`ProductStatsWithoutMemo - render #${renderCount.current}`);
	});

	// Bez useMemo - te same obliczenia będą wykonywane przy każdym renderze
	console.log("Obliczanie statystyk BEZ USEMEMO...");

	// Filtrujemy produkty - to samo co w poprzednim komponencie
	const filteredProducts = products.filter((product) => {
		if (category !== "all" && product.category !== category) {
			return false;
		}

		if (
			searchQuery &&
			!product.name.toLowerCase().includes(searchQuery.toLowerCase())
		) {
			return false;
		}

		return true;
	});

	// Obliczamy statystyki
	const totalValue = filteredProducts.reduce(
		(sum, product) => sum + product.price,
		0
	);
	const averagePrice =
		filteredProducts.length > 0
			? Math.round(totalValue / filteredProducts.length)
			: 0;

	const categoryCount = filteredProducts.reduce<Record<string, number>>(
		(counts, product) => {
			counts[product.category] = (counts[product.category] || 0) + 1;
			return counts;
		},
		{}
	);

	return (
		<div className="border rounded p-4">
			<h2 className="text-xl font-bold mb-3">Statystyki (bez useMemo)</h2>

			<div className="grid grid-cols-2 gap-4 mb-4">
				<div className="bg-blue-50 p-3 rounded">
					<div className="text-sm">Liczba produktów</div>
					<div className="text-xl font-bold">{filteredProducts.length}</div>
				</div>
				<div className="bg-green-50 p-3 rounded">
					<div className="text-sm">Średnia cena</div>
					<div className="text-xl font-bold">{averagePrice} zł</div>
				</div>
				<div className="bg-yellow-50 p-3 rounded">
					<div className="text-sm">Łączna wartość</div>
					<div className="text-xl font-bold">{totalValue} zł</div>
				</div>
			</div>

			<h3 className="font-bold mt-4 mb-2">Podział na kategorie:</h3>
			<ul>
				{Object.entries(categoryCount).map(([cat, count]) => (
					<li key={cat} className="flex justify-between py-1 border-b">
						<span>{cat}</span>
						<span>{count}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
