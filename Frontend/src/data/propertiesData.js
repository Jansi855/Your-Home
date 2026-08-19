// Location-Specific Property Mock Dataset
// Mumbai assets
import mumbai1 from '../assets/properties/mumbai/mumbai_1.jpg';
import mumbai2 from '../assets/properties/mumbai/mumbai_2.jpg';
import mumbai3 from '../assets/properties/mumbai/mumbai_3.jpg';

// Delhi assets
import delhi1 from '../assets/properties/delhi/delhi_1.jpg';
import delhi2 from '../assets/properties/delhi/delhi_2.jpg';
import delhi3 from '../assets/properties/delhi/delhi_3.jpg';

// Gurugram assets
import gurugram1 from '../assets/properties/gurugram/gurugram_1.jpg';
import gurugram2 from '../assets/properties/gurugram/gurugram_2.jpg';
import gurugram3 from '../assets/properties/gurugram/gurugram_3.jpg';

// Bengaluru assets
import bengaluru1 from '../assets/properties/bengaluru/bengaluru_1.jpg';
import bengaluru2 from '../assets/properties/bengaluru/bengaluru_2.jpg';
import bengaluru3 from '../assets/properties/bengaluru/bengaluru_3.jpg';

// Hyderabad assets
import hyderabad1 from '../assets/properties/hyderabad/hyderabad_1.jpg';
import hyderabad2 from '../assets/properties/hyderabad/hyderabad_2.jpg';
import hyderabad3 from '../assets/properties/hyderabad/hyderabad_3.jpg';

// Greater Noida assets
import greaterNoida1 from '../assets/properties/greater-noida/greater_noida_1.jpg';
import greaterNoida2 from '../assets/properties/greater-noida/greater_noida_2.jpg';
import greaterNoida3 from '../assets/properties/greater-noida/greater_noida_3.jpg';

export const propertiesData = [
  // MUMBAI PROPERTIES
  {
    id: 'mumbai-1',
    title: 'Emerald Crest Sea Heights',
    category: 'Buy',
    type: 'Residential',
    city: 'Mumbai',
    location: 'Bandra West, Mumbai',
    price: '₹2.85 Cr',
    priceVal: 28500000,
    beds: 3,
    baths: 3,
    sqft: '1,850 sq.ft',
    estEMI: '₹1.42 L/mo',
    image: mumbai1,
    images: [mumbai1, mumbai2, mumbai3],
    popular: true,
    rating: 4.9
  },
  {
    id: 'mumbai-2',
    title: 'The Marine Horizon Villa',
    category: 'Buy',
    type: 'Residential',
    city: 'Mumbai',
    location: 'Worli Sea Face, Mumbai',
    price: '₹5.40 Cr',
    priceVal: 54000000,
    beds: 4,
    baths: 5,
    sqft: '3,200 sq.ft',
    estEMI: '₹2.70 L/mo',
    image: mumbai2,
    images: [mumbai2, mumbai3, mumbai1],
    popular: true,
    rating: 4.8
  },
  {
    id: 'mumbai-3',
    title: 'Juhu Bay Luxury Apartment',
    category: 'Rent',
    type: 'Residential',
    city: 'Mumbai',
    location: 'Juhu, Mumbai',
    price: '₹1.10 L / mo',
    priceVal: 110000,
    beds: 2,
    baths: 2,
    sqft: '1,400 sq.ft',
    estEMI: 'Rental Yield 4.5%',
    image: mumbai3,
    images: [mumbai3, mumbai1, mumbai2],
    popular: false,
    rating: 4.7
  },

  // DELHI PROPERTIES
  {
    id: 'delhi-1',
    title: 'Lutyens Green Enclave',
    category: 'Buy',
    type: 'Residential',
    city: 'Delhi',
    location: 'Vasant Vihar, Delhi',
    price: '₹6.75 Cr',
    priceVal: 67500000,
    beds: 4,
    baths: 4,
    sqft: '3,100 sq.ft',
    estEMI: '₹3.35 L/mo',
    image: delhi1,
    images: [delhi1, delhi2, delhi3],
    popular: true,
    rating: 4.9
  },
  {
    id: 'delhi-2',
    title: 'Chanakyapuri Royal Villa',
    category: 'Buy',
    type: 'Residential',
    city: 'Delhi',
    location: 'Chanakyapuri, Delhi',
    price: '₹9.20 Cr',
    priceVal: 92000000,
    beds: 5,
    baths: 5,
    sqft: '4,200 sq.ft',
    estEMI: '₹4.50 L/mo',
    image: delhi2,
    images: [delhi2, delhi3, delhi1],
    popular: true,
    rating: 5.0
  },

  // GURUGRAM PROPERTIES
  {
    id: 'gurugram-1',
    title: 'Nexus Business Skyscraper',
    category: 'Commercial',
    type: 'Commercial',
    city: 'Gurugram',
    location: 'Cyber City, Gurugram',
    price: '₹8.90 Cr',
    priceVal: 89000000,
    beds: 'Office',
    baths: 4,
    sqft: '4,500 sq.ft',
    estEMI: 'ROI 8.5%/yr',
    image: gurugram1,
    images: [gurugram1, gurugram2, gurugram3],
    popular: true,
    rating: 4.9
  },
  {
    id: 'gurugram-2',
    title: 'Golf Course Skyline Duplex',
    category: 'Buy',
    type: 'Residential',
    city: 'Gurugram',
    location: 'Golf Course Road, Gurugram',
    price: '₹4.60 Cr',
    priceVal: 46000000,
    beds: 3,
    baths: 4,
    sqft: '2,800 sq.ft',
    estEMI: '₹2.30 L/mo',
    image: gurugram2,
    images: [gurugram2, gurugram3, gurugram1],
    popular: false,
    rating: 4.8
  },

  // BENGALURU PROPERTIES
  {
    id: 'bengaluru-1',
    title: 'Aura Tech Park Residences',
    category: 'Rent',
    type: 'Residential',
    city: 'Bengaluru',
    location: 'Koramangala, Bengaluru',
    price: '₹75,000 / mo',
    priceVal: 75000,
    beds: 2,
    baths: 2,
    sqft: '1,250 sq.ft',
    estEMI: 'Rental Yield 4.2%',
    image: bengaluru1,
    images: [bengaluru1, bengaluru2, bengaluru3],
    popular: false,
    rating: 4.7
  },
  {
    id: 'bengaluru-2',
    title: 'Verdant Valley Green Estate',
    category: 'Land',
    type: 'Land',
    city: 'Bengaluru',
    location: 'Whitefield, Bengaluru',
    price: '₹1.15 Cr',
    priceVal: 11500000,
    beds: 'Plot',
    baths: 0,
    sqft: '2,400 sq.ft',
    estEMI: 'High Growth Area',
    image: bengaluru2,
    images: [bengaluru2, bengaluru3, bengaluru1],
    popular: false,
    rating: 4.6
  },

  // HYDERABAD PROPERTIES
  {
    id: 'hyderabad-1',
    title: 'Skyline Panorama Penthouse',
    category: 'Buy',
    type: 'Residential',
    city: 'Hyderabad',
    location: 'Jubilee Hills, Hyderabad',
    price: '₹4.10 Cr',
    priceVal: 41000000,
    beds: 4,
    baths: 4,
    sqft: '2,900 sq.ft',
    estEMI: '₹2.05 L/mo',
    image: hyderabad1,
    images: [hyderabad1, hyderabad2, hyderabad3],
    popular: true,
    rating: 4.9
  },
  {
    id: 'hyderabad-2',
    title: 'Gachibowli Cyber View',
    category: 'Rent',
    type: 'Residential',
    city: 'Hyderabad',
    location: 'Gachibowli, Hyderabad',
    price: '₹62,000 / mo',
    priceVal: 62000,
    beds: 3,
    baths: 3,
    sqft: '1,650 sq.ft',
    estEMI: 'Rental Yield 4.4%',
    image: hyderabad2,
    images: [hyderabad2, hyderabad3, hyderabad1],
    popular: false,
    rating: 4.7
  },

  // GREATER NOIDA PROPERTIES
  {
    id: 'greater-noida-1',
    title: 'Grand Boulevard Parkview',
    category: 'Buy',
    type: 'Residential',
    city: 'Greater Noida',
    location: 'Omega 1, Greater Noida',
    price: '₹1.45 Cr',
    priceVal: 14500000,
    beds: 3,
    baths: 3,
    sqft: '1,950 sq.ft',
    estEMI: '₹72,000 / mo',
    image: greaterNoida1,
    images: [greaterNoida1, greaterNoida2, greaterNoida3],
    popular: false,
    rating: 4.7
  },
  {
    id: 'greater-noida-2',
    title: 'Expressway Crest Villa',
    category: 'Land',
    type: 'Land',
    city: 'Greater Noida',
    location: 'Sector 150, Greater Noida',
    price: '₹95.00 L',
    priceVal: 9500000,
    beds: 'Plot',
    baths: 0,
    sqft: '2,100 sq.ft',
    estEMI: 'Upcoming Metro Hub',
    image: greaterNoida2,
    images: [greaterNoida2, greaterNoida3, greaterNoida1],
    popular: false,
    rating: 4.6
  }
];
