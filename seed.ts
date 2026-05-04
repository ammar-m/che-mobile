import { db } from './src/lib/firebase.ts';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const SAMPLE_PARTS = [
  { 
    name: 'Performance Brake Pads', 
    name_ar: 'وسادات الفرامل عالية الأداء', 
    price: 120, 
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80', 
    brand: 'Brembo', 
    category: 'Brakes',
    description: 'High performance ceramic brake pads for sports cars.',
    description_ar: 'وسادات فرامل سيراميك عالية الأداء للسيارات الرياضية.',
    stock: 50
  },
  { 
    name: 'High-Flow Air Filter', 
    name_ar: 'فلتر هواء عالي التدفق', 
    price: 45, 
    imageUrl: 'https://images.unsplash.com/photo-1597404294360-feed99066606?w=800&q=80', 
    brand: 'K&N', 
    category: 'Engine',
    description: 'Cotton gauze air filter for improved air flow.',
    description_ar: 'فلتر هواء من القطن لتحسين تدفق الهواء.',
    stock: 100
  },
  { 
    name: 'LED Headlight Set', 
    name_ar: 'مجموعة مصابيح LED', 
    price: 210, 
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', 
    brand: 'Philips', 
    category: 'Lighting',
    description: 'Ultra bright 6000K LED conversion kit.',
    description_ar: 'طقم تحويل LED عالي السطوع 6000K.',
    stock: 25
  },
  { 
    name: 'Castrol Edge 5W-30', 
    name_ar: 'زيت كاسترول 5W-30', 
    price: 65, 
    imageUrl: 'https://images.unsplash.com/photo-1620939514449-6dc9b7ae2910?w=800&q=80', 
    brand: 'Castrol', 
    category: 'Fluids',
    description: 'Fully synthetic motor oil for maximum performance.',
    description_ar: 'زيت محرك اصطناعي بالكامل لأقصى أداء.',
    stock: 80
  }
];

async function seed() {
  console.log('Seeding parts...');
  const partsCol = collection(db, 'parts');
  
  // Optional: clear existing
  // const snapshot = await getDocs(partsCol);
  // for (const doc of snapshot.docs) { await deleteDoc(doc.ref); }

  for (const part of SAMPLE_PARTS) {
    await addDoc(partsCol, part);
    console.log(`Added ${part.name}`);
  }
  console.log('Seed completed!');
}

seed();
