export interface Property {
  id: string;
  name: string;
  type: 'Modern Villa' | 'Luxury Duplex' | 'Small House' | 'Apartment' | 'Farm House' | 'Commercial Building';
  price: number;
  location: string;
  area: number; // sq.ft
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  images: string[];
  brochureUrl: string;
  builder: {
    name: string;
    phone: string;
    email: string;
    company: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  featured: boolean;
  yearBuilt: number;
  floors: number;
}

export const PROPERTIES: Property[] = [
  {
    id: 'modern-villa',
    name: 'Aethera Horizon Villa',
    type: 'Modern Villa',
    price: 2450000,
    location: '1024 Sunset Crest, Beverly Hills, CA',
    area: 5800,
    bedrooms: 5,
    bathrooms: 6,
    description: 'An architectural masterpiece boasting floor-to-ceiling glass walls, a cantilevered infinity pool, and integrated smart home automation. The Aethera Horizon Villa blends sleek indoor lines with expansive outdoor terraces overlooking the canyon.',
    amenities: ['Infinity Pool', 'Home Cinema', 'Wine Cellar', 'Smart Automation', 'Private Gym', 'Solar Power Grid'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Sarah Jenkins',
      phone: '+1 (555) 304-9842',
      email: 's.jenkins@apexrealestate.com',
      company: 'Apex Design & Build'
    },
    coordinates: {
      lat: 34.0736,
      lng: -118.4004
    },
    rating: 4.9,
    featured: true,
    yearBuilt: 2025,
    floors: 2
  },
  {
    id: 'luxury-duplex',
    name: 'Vanguard Duplex Suites',
    type: 'Luxury Duplex',
    price: 1850000,
    location: '450 Skyline Drive, Austin, TX',
    area: 4200,
    bedrooms: 4,
    bathrooms: 4.5,
    description: 'A premium split-level residence featuring separate guest quarters, double-height ceilings, and polished concrete finishes. The Vanguard Duplex offers lofted living spaces and custom steel-and-wood stairs leading to a panoramic sky terrace.',
    amenities: ['Roof Terrace', 'Double Height Ceilings', 'Guest Quarters', 'Electric Charger', 'Chef Kitchen', 'Heated Floors'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Michael Chen',
      phone: '+1 (555) 782-9011',
      email: 'm.chen@apexrealestate.com',
      company: 'Apex Design & Build'
    },
    coordinates: {
      lat: 30.2672,
      lng: -97.7431
    },
    rating: 4.8,
    featured: true,
    yearBuilt: 2024,
    floors: 2
  },
  {
    id: 'small-house',
    name: 'Elysian Minimalist Cottage',
    type: 'Small House',
    price: 680000,
    location: '88 Meadow Trail, Portland, OR',
    area: 1650,
    bedrooms: 2,
    bathrooms: 2,
    description: 'A highly functional and stylish small house utilizing smart modular partitions and custom built-in furniture. Perfect for eco-conscious buyers seeking luxury within a compact footprint. Features a beautiful lofted bedroom and private patio.',
    amenities: ['Modular Partitioning', 'Rainwater Harvesting', 'Private Patio', 'Skylights', 'Energy Star Appliances', 'Lofted Storage'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Sarah Jenkins',
      phone: '+1 (555) 304-9842',
      email: 's.jenkins@apexrealestate.com',
      company: 'Apex Design & Build'
    },
    coordinates: {
      lat: 45.5152,
      lng: -122.6784
    },
    rating: 4.7,
    featured: false,
    yearBuilt: 2025,
    floors: 1
  },
  {
    id: 'apartment',
    name: 'Lumina Sky Penthouse',
    type: 'Apartment',
    price: 1350000,
    location: 'Suite 3402, 88 Pine St, Seattle, WA',
    area: 2500,
    bedrooms: 3,
    bathrooms: 3,
    description: 'An executive penthouse sitting on the 34th floor of the Lumina Towers, featuring dramatic views of Puget Sound. Offers an open-concept kitchen, custom marble island, high-end Gaggenau appliances, and access to five-star tower amenities.',
    amenities: ['24/7 Concierge', 'Valet Parking', 'Indoor Pool', 'Rooftop Lounge', 'Private Elevator', 'Spa Facilities'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Jessica Vance',
      phone: '+1 (555) 901-4433',
      email: 'j.vance@luminaresidences.com',
      company: 'Lumina Premium Group'
    },
    coordinates: {
      lat: 47.6062,
      lng: -122.3321
    },
    rating: 4.6,
    featured: true,
    yearBuilt: 2023,
    floors: 1
  },
  {
    id: 'farm-house',
    name: 'Serene Valleys Homestead',
    type: 'Farm House',
    price: 1100000,
    location: '12 Oak Ridge Road, Napa Valley, CA',
    area: 3800,
    bedrooms: 4,
    bathrooms: 4,
    description: 'A modern farmhouse nestled among private vineyards. Features a large wraparound porch, exposed cedar timber beams, double-sided fireplace, and custom farmhouse kitchen with a premium AGA range cooker.',
    amenities: ['Wraparound Porch', 'Private Vineyard', 'Barn Storage', 'Outdoor Pizza Oven', 'Wine Cellar', 'Spring Water Well'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Michael Chen',
      phone: '+1 (555) 782-9011',
      email: 'm.chen@apexrealestate.com',
      company: 'Apex Design & Build'
    },
    coordinates: {
      lat: 38.2975,
      lng: -122.2869
    },
    rating: 4.9,
    featured: false,
    yearBuilt: 2024,
    floors: 1.5
  },
  {
    id: 'commercial-building',
    name: 'Zenith Tech Headquarter',
    type: 'Commercial Building',
    price: 8500000,
    location: '120 Innovation Way, San Jose, CA',
    area: 15400,
    bedrooms: 0,
    bathrooms: 12,
    description: 'A sleek, state-of-the-art office building designed for collaborative teams. It offers open-concept workstations, modular boardrooms, high-tech network hubs, automated climate control, and a rooftop café.',
    amenities: ['Rooftop Café', 'Smart Boardrooms', 'Fiber Optic Hub', 'Multi-zone HVAC', 'Secure Access Control', 'Solar Glass Façade'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ],
    brochureUrl: '#',
    builder: {
      name: 'Vince Sterling',
      phone: '+1 (555) 124-7788',
      email: 'vince@sterlingbuilders.com',
      company: 'Sterling Commercial'
    },
    coordinates: {
      lat: 37.3382,
      lng: -121.8863
    },
    rating: 4.8,
    featured: true,
    yearBuilt: 2025,
    floors: 3
  }
];
