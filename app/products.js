// products.js
// Plik zawierający wygenerowane dane produktów dla demonstracji useMemo

// Funkcja generująca duży zbiór produktów
const generateLargeProductSet = () => {
  // Sprawdzamy czy jesteśmy w środowisku przeglądarki
  if (typeof window === 'undefined') {
    console.log('Generowanie produktów pominięte - środowisko SSR');
    return [];
  }
  
  // Bazowe kategorie
  const categories = [
    "electronics", 
    "books", 
    "furniture", 
    "clothing", 
    "toys", 
    "garden", 
    "beauty", 
    "sports", 
    "food", 
    "automotive"
  ];
  
  // Bazowe prefiksy nazw produktów dla każdej kategorii
  const productPrefixes = {
    electronics: [
      "Laptop", "Smartfon", "Tablet", "Monitor", "Klawiatura", "Mysz", "Słuchawki", 
      "Telewizor", "Konsola", "Drukarka", "Kamera", "Głośnik", "Powerbank", "Dysk SSD"
    ],
    books: [
      "JavaScript - poradnik", "React w praktyce", "TypeScript dla początkujących", 
      "Algorytmy i struktury danych", "Python dla każdego", "C++ dla profesjonalistów",
      "SQL dla zaawansowanych", "Machine Learning", "Projektowanie UX", "Clean Code"
    ],
    furniture: [
      "Biurko", "Krzesło", "Sofa", "Regał", "Szafa", "Łóżko", "Fotel", "Stół", 
      "Komoda", "Półka", "Witryna", "Pufa", "Stolik kawowy", "Materac"
    ],
    clothing: [
      "Koszulka", "Spodnie", "Bluza", "Kurtka", "Sukienka", "Sweter", "Koszula", 
      "Czapka", "Szalik", "Skarpetki", "Buty", "Pasek", "Rękawiczki"
    ],
    toys: [
      "Klocki", "Lalka", "Samochodzik", "Gra planszowa", "Puzzle", "Pluszak", 
      "Robot", "Zestaw kreatywny", "Gra edukacyjna", "Model do sklejania"
    ],
    garden: [
      "Sekator", "Kosiarka", "Doniczka", "Nasiona", "Łopata", "Grabie", "Taczka", 
      "Wąż ogrodowy", "Huśtawka", "Krzesło ogrodowe", "Grill", "Parasol"
    ],
    beauty: [
      "Perfumy", "Krem", "Szampon", "Balsam", "Maseczka", "Tusz do rzęs", 
      "Pomadka", "Puder", "Eyeliner", "Cień do powiek", "Lakier do paznokci"
    ],
    sports: [
      "Piłka", "Rakieta", "Rower", "Hantle", "Mata do jogi", "Rolki", "Narty", 
      "Kask", "Ochraniacze", "Dres", "Buty sportowe", "Torba sportowa"
    ],
    food: [
      "Kawa", "Herbata", "Czekolada", "Oliwa", "Przyprawy", "Bakalie", 
      "Miód", "Dżem", "Mąka", "Makaron", "Ryż", "Olej", "Cukier"
    ],
    automotive: [
      "Olej silnikowy", "Opony", "Wycieraczki", "Żarówki", "Klucze", "Akumulator", 
      "Pokrowce", "Odświeżacz", "Środek do czyszczenia", "Apteczka", "Kamizelka"
    ]
  };
  
  // Bazowe sufiksy dla nazw produktów
  const suffixes = [
    "Premium", "Pro", "Standard", "Basic", "Deluxe", "Ultra", "Classic", 
    "Elite", "Eco", "Smart", "Advanced", "Compact", "Comfort", "Prestige"
  ];
  
  // Marki dla każdej kategorii
  const brands = {
    electronics: ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "LG", "Asus", "Acer", "Huawei", "Xiaomi"],
    books: ["PWN", "Helion", "O'Reilly", "Apress", "Manning", "Packt", "Wiley", "No Starch Press"],
    furniture: ["IKEA", "BRW", "VOX", "Agata", "Kler", "Bodzio", "Swarzędz", "Forte"],
    clothing: ["Nike", "Adidas", "H&M", "Zara", "Reserved", "Levi's", "Tommy Hilfiger", "Calvin Klein"],
    toys: ["Lego", "Mattel", "Hasbro", "Fisher-Price", "Playmobil", "Cobi", "Trefl", "Ravensburger"],
    garden: ["Gardena", "Bosch", "Husqvarna", "Fiskars", "Stihl", "McCulloch", "Hozelock", "Cellfast"],
    beauty: ["L'Oreal", "Maybelline", "Nivea", "Garnier", "Dove", "Vichy", "Avon", "Revlon", "Bourjois"],
    sports: ["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "Speedo", "Wilson", "Head", "Kross"],
    food: ["Nestlé", "Wedel", "Wawel", "Kamis", "Knorr", "Pudliszki", "Winiary", "Bakalland", "Kujawski"],
    automotive: ["Castrol", "Mobil", "Shell", "Michelin", "Bosch", "Philips", "Continental", "Goodyear"]
  };
  
  // Generowanie dużego zbioru produktów
  const products = [];
  let id = 1;
  
  // Dla każdej kategorii generujemy wiele produktów
  categories.forEach(category => {
    const prefixes = productPrefixes[category];
    const categoryBrands = brands[category];
    
    // Dla każdego prefiksu (typu produktu)
    prefixes.forEach(prefix => {
      // Dla każdej marki
      categoryBrands.forEach(brand => {
        // Dla każdego sufiksu
        suffixes.forEach((suffix, suffixIndex) => {
          // Nie wszystkie kombinacje, aby ograniczyć rozmiar zbioru
          if (suffixIndex % 3 === 0) {
            // Określ bazową cenę dla kategorii produktu
            let basePrice;
            switch (category) {
              case 'electronics': basePrice = 1000 + Math.floor(Math.random() * 5000); break;
              case 'books': basePrice = 40 + Math.floor(Math.random() * 150); break;
              case 'furniture': basePrice = 300 + Math.floor(Math.random() * 3000); break;
              case 'clothing': basePrice = 50 + Math.floor(Math.random() * 400); break;
              case 'toys': basePrice = 30 + Math.floor(Math.random() * 300); break;
              case 'garden': basePrice = 50 + Math.floor(Math.random() * 700); break;
              case 'beauty': basePrice = 20 + Math.floor(Math.random() * 200); break;
              case 'sports': basePrice = 60 + Math.floor(Math.random() * 800); break;
              case 'food': basePrice = 10 + Math.floor(Math.random() * 100); break;
              case 'automotive': basePrice = 40 + Math.floor(Math.random() * 500); break;
              default: basePrice = 100 + Math.floor(Math.random() * 1000);
            }
            
            // Dodaj modyfikator ceny w zależności od sufiksu
            let priceModifier = 1.0;
            if (suffix === "Premium" || suffix === "Pro" || suffix === "Deluxe" || suffix === "Elite" || suffix === "Prestige") {
              priceModifier = 1.5 + Math.random() * 0.5; // Droższe o 50-100%
            } else if (suffix === "Basic" || suffix === "Eco" || suffix === "Compact") {
              priceModifier = 0.7 + Math.random() * 0.2; // Tańsze o 10-30%
            }
            
            const finalPrice = Math.round(basePrice * priceModifier);
            
            // Dodaj produkt do listy
            products.push({
              id: id++,
              name: `${prefix} ${brand} ${suffix}`,
              price: finalPrice,
              category: category,
              brand: brand,
              featured: Math.random() < 0.1 // 10% produktów to "wyróżnione"
            });
          }
        });
      });
    });
  });
  
  // Zwróć wygenerowany zbiór produktów
  console.log(`Wygenerowano ${products.length} produktów`);
  return products;
};

// Definiujemy początkowy pusty zbiór produktów
let products = [];

// Bezpieczne generowanie produktów (tylko w środowisku przeglądarki)
if (typeof window !== 'undefined') {
  try {
    products = generateLargeProductSet();
  } catch (error) {
    console.error('Błąd generowania produktów:', error);
    // Awaryjny, minimalny zestaw produktów
    products = [
      { id: 1, name: "Laptop Dell XPS", price: 5200, category: "electronics", brand: "Dell", featured: false },
      { id: 2, name: "Słuchawki Sony", price: 800, category: "electronics", brand: "Sony", featured: false },
      { id: 3, name: "Książka 'React w praktyce'", price: 89, category: "books", brand: "Helion", featured: false },
      { id: 4, name: "Smartfon Samsung", price: 2800, category: "electronics", brand: "Samsung", featured: true },
      { id: 5, name: "Biurko ergonomiczne", price: 1200, category: "furniture", brand: "IKEA", featured: false }
    ];
  }
}

// Eksportujemy wygenerowane produkty
export { products };