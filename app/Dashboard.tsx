// Dashboard.tsx - Komponent Dashboard wydzielony do osobnego pliku
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { products } from "./products"; // Importujemy produkty z oddzielnego pliku

// Komponent główny
function Dashboard() {
	// Globalny stan aplikacji
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [forceRenderCounter, setForceRenderCounter] = useState(0);
	const [useMemoEnabled, setUseMemoEnabled] = useState(true);

	// Liczniki wywołań - używamy useRef zamiast useState
	const memoInvocationsRef = useRef(0);
	const noMemoInvocationsRef = useRef(0);

	// Resetowanie liczników
	const resetCounters = () => {
		memoInvocationsRef.current = 0;
		noMemoInvocationsRef.current = 0;
		// Wymuszamy re-render, aby zaktualizować interfejs
		setForceRenderCounter((prev) => prev + 1);
	};

	// Obsługa przycisku wymuszającego re-render
	const handleForceRender = () => {
		setForceRenderCounter((prev) => prev + 1);
	};

	// Funkcja obsługująca wyszukiwanie
	const handleSearch = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<header className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">
					Panel produktów - przykład useMemo
				</h1>
			</header>

			<div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded">
				<h2 className="text-lg font-bold mb-2">Panel demonstracyjny</h2>
				<div className="flex flex-wrap gap-4 mb-4">
					<div className="bg-green-100 p-3 rounded">
						<div className="text-sm">Wywołania z useMemo</div>
						<div className="text-xl font-bold">
							{memoInvocationsRef.current}
						</div>
					</div>
					<div className="bg-red-100 p-3 rounded">
						<div className="text-sm">Wywołania bez useMemo</div>
						<div className="text-xl font-bold">
							{noMemoInvocationsRef.current}
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-4 mb-2">
					<button
						onClick={handleForceRender}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
					>
						Wymuś re-render (kliknięto {forceRenderCounter} razy)
					</button>

					<button
						onClick={resetCounters}
						className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded transition"
					>
						Resetuj liczniki
					</button>

					<label className="flex items-center cursor-pointer">
						<div className="relative">
							<input
								type="checkbox"
								className="sr-only"
								checked={useMemoEnabled}
								onChange={() => setUseMemoEnabled(!useMemoEnabled)}
							/>
							<div
								className={`block w-14 h-8 rounded-full ${useMemoEnabled ? "bg-green-400" : "bg-gray-400"}`}
							></div>
							<div
								className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${useMemoEnabled ? "transform translate-x-6" : ""}`}
							></div>
						</div>
						<div className="ml-3 text-gray-700 font-medium">
							useMemo {useMemoEnabled ? "włączone" : "wyłączone"}
						</div>
					</label>
				</div>
			</div>

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
					<option value="clothing">Odzież</option>
					<option value="toys">Zabawki</option>
					<option value="garden">Ogród</option>
					<option value="beauty">Uroda</option>
					<option value="sports">Sport</option>
					<option value="food">Żywność</option>
					<option value="automotive">Motoryzacja</option>
				</select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<ProductListWithMemo
					category={selectedCategory}
					searchQuery={searchQuery}
					useMemoEnabled={useMemoEnabled}
					forceRenderCounter={forceRenderCounter}
					memoInvocationsRef={memoInvocationsRef}
					noMemoInvocationsRef={noMemoInvocationsRef}
				/>
				<ProductStats category={selectedCategory} searchQuery={searchQuery} />
			</div>

			<div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
				<h2 className="text-lg font-bold mb-2">Jak działa useMemo?</h2>
				<p className="mb-2">
					Hook <code>useMemo</code> pozwala na "zapamiętanie" wyniku kosztownych
					obliczeniowo operacji, aby uniknąć ich ponownego wykonywania przy
					każdym re-renderze komponentu.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<div className="p-3 bg-green-50 rounded">
						<h3 className="font-bold">Z useMemo</h3>
						<pre className="text-xs mt-2 bg-white p-2 rounded">
							{`const filteredProducts = useMemo(() => {
  // Ta funkcja wykona się tylko gdy 
  // zmienią się category lub searchQuery
  return products.filter(...);
}, [category, searchQuery]);`}
						</pre>
					</div>
					<div className="p-3 bg-red-50 rounded">
						<h3 className="font-bold">Bez useMemo</h3>
						<pre className="text-xs mt-2 bg-white p-2 rounded">
							{`// Ta operacja będzie wykonywana
// przy KAŻDYM renderze komponentu
const filteredProducts = products.filter(...);`}
						</pre>
					</div>
				</div>

				<h3 className="font-bold mt-6 mb-2">Eksperyment:</h3>
				<ol className="list-decimal pl-5">
					<li>
						Kliknij kilka razy przycisk "Wymuś re-render" i obserwuj różnicę w
						licznikach
					</li>
					<li>
						Zmień kategorię lub wpisz coś w pole wyszukiwania - obie metody
						wykonają filtrowanie
					</li>
					<li>Włącz/wyłącz przełącznik useMemo, aby zobaczyć różnicę</li>
				</ol>
			</div>
		</div>
	);
}

// Komponent z listą produktów i demonstracją useMemo
function ProductListWithMemo({
	category,
	searchQuery,
	useMemoEnabled,
	forceRenderCounter,
	memoInvocationsRef,
	noMemoInvocationsRef,
}) {
	// Zliczanie renderów
	const renderCount = useRef(0);
	useEffect(() => {
		renderCount.current += 1;
		console.log(`ProductListWithMemo - render #${renderCount.current}`);
	});

	// Referencje dla czasów wykonania
	const timeWithMemoRef = useRef(0);
	const timeWithoutMemoRef = useRef(0);

	// Bezpieczna funkcja do pomiaru czasu (działa zarówno w środowisku przeglądarki jak i podczas SSR)
	const getTime = () => {
		return typeof performance !== "undefined" ? performance.now() : 0;
	};

	// Funkcja filtrowania z mierzeniem czasu i bardziej złożonymi operacjami
	const filterProducts = useCallback(() => {
		// Bezpieczny pomiar czasu
		const startTime = getTime();

		// Sprawdzamy czy jesteśmy w środowisku przeglądarki
		if (typeof window === "undefined") {
			return {
				filtered: [],
				executionTime: 0,
			};
		}

		// Dodajemy sztuczne opóźnienie - symulacja bardzo złożonej operacji (50ms)
		const delay = 50;
		const startDelay = getTime();
		while (getTime() - startDelay < delay) {
			// Blokujemy wątek celowo dla symulacji kosztownych obliczeń
		}

		// Wykonujemy kosztowne operacje na danych - im więcej produktów, tym dłużej to trwa
		// Ta część będzie efektywnie pokazywać różnicę przy dużym zbiorze danych
		let allProducts = [...products];

		// Pierwsza kosztowna operacja - wielokrotne sortowanie i mapowanie
		for (let i = 0; i < 5; i++) {
			// Przypisujemy losowe wagi do produktów
			allProducts = allProducts.map((p) => ({
				...p,
				weight: Math.random() * p.price,
				score: (p.featured ? 2 : 1) * (1000 / (p.price + 1)) * Math.random(),
			}));

			// Sortujemy produkty wg różnych kryteriów
			if (i % 2 === 0) {
				allProducts.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
			} else {
				allProducts.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
			}
		}

		// Właściwe filtrowanie - to już jest kosztowna operacja przy dużym zbiorze danych
		const filtered = products
			.filter((product) => {
				// Filtruj po kategorii
				if (category !== "all" && product.category !== category) {
					return false;
				}

				// Filtruj po zapytaniu wyszukiwania - przeszukujemy zarówno nazwę jak i markę
				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					const nameMatch = product.name.toLowerCase().includes(query);
					const brandMatch =
						product.brand && product.brand.toLowerCase().includes(query);
					if (!nameMatch && !brandMatch) {
						return false;
					}
				}

				return true;
			})
			// Dodatkowe sortowanie i limitowanie wyników
			.sort((a, b) => {
				// Najpierw sortujemy po wyróżnionych produktach
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;

				// Następnie po cenie
				return a.price - b.price;
			});

		const endTime = getTime();
		return {
			filtered,
			executionTime: endTime - startTime,
		};
	}, [category, searchQuery]);

	// POPRAWKA: Zawsze wywołuj useMemo, niezależnie od flagi useMemoEnabled
	// Używamy useMemo zawsze, aby przestrzegać reguł Hooków
	const memoizedResult = useMemo(() => {
		// Inkrementuj licznik tylko tutaj, aby liczyć faktyczne wykonania funkcji memoizowanej
		console.log("🔶 Filtrowanie Z USEMEMO...");
		memoInvocationsRef.current += 1;
		return filterProducts();
	}, [filterProducts]);

	// Zawsze obliczamy też wersję bez memoizacji
	// Dzięki temu możemy porównać obie implementacje
	console.log("🔴 Filtrowanie BEZ USEMEMO...");
	noMemoInvocationsRef.current += 1;
	const nonMemoizedResult = filterProducts();
	timeWithoutMemoRef.current = nonMemoizedResult.executionTime;

	// Wybierz właściwy wynik bazując na stanie przełącznika
	// W prawdziwym kodzie mielibyśmy tylko jedną z tych implementacji
	const productsResult = useMemoEnabled ? memoizedResult : nonMemoizedResult;
	const executionTime = productsResult.executionTime;

	if (useMemoEnabled) {
		timeWithMemoRef.current = executionTime;
	}

	const productsToDisplay = productsResult.filtered;

	return (
		<div className="border rounded p-4">
			<h2 className="text-xl font-bold mb-3">
				Lista produktów ({useMemoEnabled ? "z useMemo" : "bez useMemo"})
			</h2>
			<p className="mb-1 text-sm">
				Znaleziono: {productsToDisplay.length} produktów
				<span className="text-gray-500 ml-1">
					(render #{renderCount.current})
				</span>
			</p>
			<p className="mb-3 text-xs text-gray-500">
				Czas wykonania: {executionTime.toFixed(2)} ms
			</p>

			<ul className="divide-y max-h-96 overflow-y-auto">
				{productsToDisplay.map((product) => (
					<li key={product.id} className="py-2">
						<div className="font-medium">
							{product.name}
							{product.featured && (
								<span className="ml-2 text-xs bg-yellow-200 px-1 rounded">
									Wyróżniony
								</span>
							)}
						</div>
						<div className="text-sm text-gray-600">
							{product.price} zł - {product.category}
							{product.brand && <span> - {product.brand}</span>}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

// Komponent statystyk - prosty, bez demonstracji useMemo
function ProductStats({ category, searchQuery }) {
	// Filtrujemy produkty
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

	const categoryCount = filteredProducts.reduce(
		(counts, product) => {
			counts[product.category] = (counts[product.category] || 0) + 1;
			return counts;
		},
		{} as Record<string, number>
	);

	// Dodatkowe statystyki
	const priceRanges = {
		low: filteredProducts.filter((p) => p.price < 200).length,
		medium: filteredProducts.filter((p) => p.price >= 200 && p.price < 1000)
			.length,
		high: filteredProducts.filter((p) => p.price >= 1000).length,
	};

	// Statystyki marek (tylko dla nowych danych z markami)
	const brandCount = filteredProducts.reduce(
		(counts, product) => {
			if (product.brand) {
				counts[product.brand] = (counts[product.brand] || 0) + 1;
			}
			return counts;
		},
		{} as Record<string, number>
	);

	// Pobieramy top 5 najczęstszych marek
	const topBrands = Object.entries(brandCount as Record<string, number>)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return (
		<div className="border rounded p-4">
			<h2 className="text-xl font-bold mb-3">Statystyki produktów</h2>

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
				<div className="bg-purple-50 p-3 rounded">
					<div className="text-sm">Przedział cenowy</div>
					<div className="text-sm">
						Niski (&lt;200 zł): {priceRanges.low}, Średni (200-999 zł):{" "}
						{priceRanges.medium}, Wysoki (≥1000 zł): {priceRanges.high}
					</div>
				</div>
			</div>

			<h3 className="font-bold mt-4 mb-2">Podział na kategorie:</h3>
			<ul className="max-h-36 overflow-y-auto mb-4">
				{Object.entries(categoryCount as Record<string, number>).map(
					([cat, count]) => (
						<li key={cat} className="flex justify-between py-1 border-b">
							<span>{cat}</span>
							<span>{count}</span>
						</li>
					)
				)}
			</ul>

			{topBrands.length > 0 && (
				<>
					<h3 className="font-bold mt-4 mb-2">Top 5 marek:</h3>
					<ul className="max-h-36 overflow-y-auto">
						{topBrands.map(([brand, count]) => (
							<li key={brand} className="flex justify-between py-1 border-b">
								<span>{brand}</span>
								<span>{count}</span>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}

// Eksportujemy komponent Dashboard jako domyślny
export default Dashboard;
