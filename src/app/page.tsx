'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, ArrowUpRight, CheckCircle2, 
  MapPin, HelpCircle, Compass, Heart, ArrowRightLeft, BookOpen 
} from 'lucide-react';
import { PROPERTIES, Property } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import PropertyDetails from '../components/PropertyDetails';
import CompareWidget from '../components/CompareWidget';

const DESIGN_CATEGORIES = [
  { name: 'Modern Villa', description: 'Expansive architecture with floor-to-ceiling glass', id: 'modern-villa' },
  { name: 'Luxury Duplex', description: 'Lofted double-height dual family structures', id: 'luxury-duplex' },
  { name: 'Small House', description: 'Cozy, highly space-efficient modular cottages', id: 'small-house' },
  { name: 'Apartment', description: 'Multi-level high-rise premium penthouses', id: 'apartment' },
  { name: 'Farm House', description: 'Ranch styling with private vineyards & acreage', id: 'farm-house' },
  { name: 'Commercial Building', description: 'State-of-the-art office blocks & hubs', id: 'commercial-building' },
];

export default function Home() {
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(9000000);

  // Favorites & Comparison State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Detailed view state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toggle Favorite Helper
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Toggle Compare Helper
  const handleToggleCompare = (property: Property) => {
    setComparedProperties((prev) => {
      const exists = prev.find((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties at a time.');
        return prev;
      }
      return [...prev, property];
    });
  };

  // Filtered Properties Memo
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((property) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.name.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query);

      const matchesType = selectedType === 'all' || property.type === selectedType;

      const matchesBeds =
        selectedBedrooms === 'all' ||
        (selectedBedrooms === '4+' ? property.bedrooms >= 4 : property.bedrooms === parseInt(selectedBedrooms));

      const matchesPrice = property.price <= maxPrice;

      const matchesFavorite = !showFavoritesOnly || favorites.includes(property.id);

      return matchesSearch && matchesType && matchesBeds && matchesPrice && matchesFavorite;
    });
  }, [searchQuery, selectedType, selectedBedrooms, maxPrice, showFavoritesOnly, favorites]);

  // Handle Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      alert('Thank you for contacting us! Our real estate consultant will email you shortly.');
    }, 1500);
  };

  // Find category and open direct 3D details
  const handleCategory3DClick = (categoryName: string) => {
    const propertyMatch = PROPERTIES.find((p) => p.type === categoryName);
    if (propertyMatch) {
      setSelectedProperty(propertyMatch);
    } else {
      alert(`3D Architectural preview for "${categoryName}" is loading...`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-30 glass shadow-sm border-b border-stone-150 dark:border-stone-850">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow shadow-primary/20">
              A
            </div>
            <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Apex3D Estates
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-300">
            <a href="#hero" className="hover:text-primary transition-colors">Home</a>
            <a href="#properties" className="hover:text-primary transition-colors">Properties</a>
            <a href="#showroom" className="hover:text-primary transition-colors">3D Showroom</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites ({favorites.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative py-24 px-6 overflow-hidden bg-stone-950 text-white border-b border-stone-900">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2e2a24_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <span className="text-accent text-[10px] font-black uppercase tracking-widest bg-primary/10 py-1.5 px-3.5 rounded-full border border-primary/20 w-max">
              The Luxury Real Estate Standard
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-stone-50 via-stone-200 to-accent bg-clip-text text-transparent">
              Explore Your Future Home in Immersive 3D
            </h1>
            <p className="text-stone-400 text-xs md:text-sm max-w-xl leading-relaxed">
              Apex3D Estates blends high-end architecture with next-generation interactive simulation. Change finishes, measure space layouts, toggle lighting, and preview your custom build in real time.
            </p>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-stone-800 pt-6 mt-2 max-w-lg">
              <div>
                <p className="text-2xl font-black text-accent">100%</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Interactive PBR</p>
              </div>
              <div>
                <p className="text-2xl font-black text-accent">2.4M+</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Virtual Walkthroughs</p>
              </div>
              <div>
                <p className="text-2xl font-black text-accent">4.9★</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Average Client Rating</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 font-sans">
              <a 
                href="#properties" 
                className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                Browse Listings
              </a>
              <a 
                href="#showroom" 
                className="bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
              >
                Explore 3D Showroom
              </a>
            </div>
          </div>

          {/* Isometric Decorative Blueprint */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-primary/30 to-accent/10 border border-primary/20 relative flex items-center justify-center animate-float overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-75"></div>
              <div className="w-44 h-44 border-2 border-primary/45 rounded-2xl relative rotate-45 transform flex items-center justify-center">
                <div className="w-32 h-32 border border-accent/30 rounded-xl absolute"></div>
                <div className="w-16 h-16 border-2 border-primary/50 rounded-md absolute bg-primary/10"></div>
                <div className="absolute -top-6 -right-6 text-[10px] font-black text-rose-500 tracking-wider flex items-center gap-1">
                  <span>📐 15.4 ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filter Panel */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 w-full">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-150 dark:border-stone-850 shadow-xl p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary dark:text-accent font-extrabold text-sm tracking-wide">
            <SlidersHorizontal className="w-4.5 h-4.5" />
            <span>Search Filter Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Location */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider mb-1.5">Location / Property</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by city or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 rounded-xl border border-stone-200 dark:border-stone-850 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Property Type selection */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider mb-1.5">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-850 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="all">All Properties</option>
                <option value="Modern Villa">Modern Villa</option>
                <option value="Luxury Duplex">Luxury Duplex</option>
                <option value="Small House">Small House</option>
                <option value="Apartment">Apartment</option>
                <option value="Farm House">Farm House</option>
                <option value="Commercial Building">Commercial Building</option>
              </select>
            </div>

            {/* Bedrooms count selection */}
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider mb-1.5">Bedrooms</label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-850 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="all">Any Beds</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4+">4+ Bedrooms</option>
              </select>
            </div>

            {/* Max Budget filter */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider">Max Price</label>
                <span className="text-xs font-bold text-primary dark:text-accent">${(maxPrice / 1000000).toFixed(2)}M</span>
              </div>
              <input
                type="range"
                min={500000}
                max={9000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Listings Grid */}
      <section id="properties" className="max-w-7xl mx-auto px-6 py-20 w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-primary dark:text-accent text-xs font-bold uppercase tracking-widest">Available Listings</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1">Featured Available Properties</h2>
          </div>
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Showing <span className="text-stone-800 dark:text-stone-200 font-bold">{filteredProperties.length}</span> of {PROPERTIES.length} properties
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center text-stone-500">
            <p className="text-sm font-bold">No properties match your filter preferences.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedBedrooms('all');
                setMaxPrice(9000000);
                setShowFavoritesOnly(false);
              }}
              className="mt-3 text-xs font-bold text-primary dark:text-accent hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={setSelectedProperty}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={comparedProperties.some((p) => p.id === property.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {/* Showroom Catalog */}
      <section id="showroom" className="bg-stone-900 text-white py-20 px-6 border-y border-stone-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-accent text-xs font-black uppercase tracking-widest">3D Showroom</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Interactive Architectural Blueprints</h2>
            <p className="text-stone-450 text-xs md:text-sm mt-2">
              Select an architectural blueprint theme catalog below to open our 3D Studio Configurator. Test finishes, remove roofs, toggle moonlight settings, and measure layouts in high fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGN_CATEGORIES.map((category) => (
              <div 
                key={category.id}
                onClick={() => handleCategory3DClick(category.name)}
                className="bg-stone-950 p-6 rounded-2xl border border-stone-850 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between group min-h-[160px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary/10 text-accent text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border border-primary/20">
                      3D Configurator Ready
                    </span>
                    <ArrowUpRight className="w-4.5 h-4.5 text-stone-600 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-sm text-stone-100 group-hover:text-accent transition-colors mb-1.5 capitalize">
                    {category.name}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 font-sans">
                    {category.description}
                  </p>
                </div>
                <div className="text-accent font-bold text-[11px] mt-4 flex items-center gap-1 uppercase tracking-wider leading-none font-sans">
                  <span>Explore Model</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact consultation */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-20 w-full">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/60 dark:border-stone-800 shadow-md p-6 text-center">
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-50 mb-1.5">Have Questions? Contact Apex Builders</h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto mb-6">
            Get in touch with our design engineers or property consultants regarding pricing sheets or customized 3D builds.
          </p>

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Michael Smith"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-xl border border-stone-250 dark:border-stone-800 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Your Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. m.smith@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-xl border border-stone-250 dark:border-stone-800 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Message Description</label>
              <textarea
                required
                rows={4}
                placeholder="What details are you looking for..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="w-full mt-1.5 py-2.5 px-4 rounded-xl border border-stone-250 dark:border-stone-800 dark:bg-stone-950 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-primary/10 active:scale-[0.98] transition-all text-center mt-2 cursor-pointer"
            >
              Submit Consultation Request
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-950 text-stone-500 text-xs py-10 px-6 border-t border-stone-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm shadow">
              A
            </div>
            <span className="font-extrabold text-sm tracking-wide text-stone-100">
              Apex3D Estates
            </span>
          </div>

          <p className="text-[11px] text-stone-600">
            © {new Date().getFullYear()} Apex3D Estates. All rights reserved. Procedural 3D PBR rendering by Antigravity.
          </p>

          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Compare Widget */}
      <CompareWidget
        comparedProperties={comparedProperties}
        onRemove={(id) => setComparedProperties((prev) => prev.filter((p) => p.id !== id))}
        onClearAll={() => setComparedProperties([])}
        onViewDetails={setSelectedProperty}
      />

    </div>
  );
}
