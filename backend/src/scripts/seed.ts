import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Resource } from '../models/Resource.js';
import type { IResource } from '../types/resource.js';

// Load environment variables
config();

/**
 * Sample resources data for seeding
 * Replace drivePdfId and driveCdrId with actual Google Drive file IDs
 */
const sampleResources: Omit<IResource, '_id' | 'createdAt' | 'updatedAt'>[] = [
  // Bhagwan / Deity Resources
  {
    title: 'Lord Ganesha Traditional Line Art',
    slug: 'lord-ganesha-traditional-line-art',
    category: 'bhagwan',
    tags: ['ganesh', 'ganesha', 'traditional', 'hindu', 'wedding-card', 'line-art'],
    description: 'Beautiful traditional Lord Ganesha line art design, perfect for wedding card headers and invitation decorations. High-resolution vector format suitable for print.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_1',
    driveCdrId: 'SAMPLE_CDR_ID_1',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },
  {
    title: 'Goddess Lakshmi Diwali Design',
    slug: 'goddess-lakshmi-diwali-design',
    category: 'bhagwan',
    tags: ['lakshmi', 'diwali', 'hindu', 'goddess', 'prosperity'],
    description: 'Elegant Goddess Lakshmi design ideal for Diwali cards and prosperity-themed invitations.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_2',
    formats: ['pdf'],
    featured: false,
    downloadCount: 0,
  },
  {
    title: 'Radha Krishna Divine Love',
    slug: 'radha-krishna-divine-love',
    category: 'bhagwan',
    tags: ['krishna', 'radha', 'love', 'hindu', 'wedding'],
    description: 'Romantic Radha Krishna artwork symbolizing divine love, perfect for engagement and wedding cards.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_3',
    driveCdrId: 'SAMPLE_CDR_ID_3',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },

  // Frame Resources
  {
    title: 'Royal Gold Ornate Frame',
    slug: 'royal-gold-ornate-frame',
    category: 'frames',
    tags: ['frame', 'gold', 'royal', 'ornate', 'border', 'luxury'],
    description: 'Luxurious gold ornate frame with intricate patterns, ideal for premium wedding invitations.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_4',
    driveCdrId: 'SAMPLE_CDR_ID_4',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },
  {
    title: 'Floral Corner Border Set',
    slug: 'floral-corner-border-set',
    category: 'frames',
    tags: ['floral', 'corner', 'border', 'flowers', 'elegant'],
    description: 'Set of 4 floral corner designs for elegant card borders. Works beautifully with any color scheme.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_5',
    driveCdrId: 'SAMPLE_CDR_ID_5',
    formats: ['pdf', 'cdr'],
    featured: false,
    downloadCount: 0,
  },

  // Couple Initials / Monograms
  {
    title: 'Classic Monogram Frame A-Z',
    slug: 'classic-monogram-frame-a-z',
    category: 'initials',
    tags: ['monogram', 'initials', 'couple', 'classic', 'alphabet'],
    description: 'Complete A-Z alphabet monogram set with elegant frame design. Customize with couple initials.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_6',
    driveCdrId: 'SAMPLE_CDR_ID_6',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },
  {
    title: 'Heart Wreath Initial Logo',
    slug: 'heart-wreath-initial-logo',
    category: 'initials',
    tags: ['heart', 'wreath', 'initials', 'romantic', 'couple-logo'],
    description: 'Romantic heart-shaped wreath design for couple initials. Perfect for save-the-dates.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_7',
    formats: ['pdf'],
    featured: false,
    downloadCount: 0,
  },

  // Templates
  {
    title: 'Traditional Gujarati Wedding Card',
    slug: 'traditional-gujarati-wedding-card',
    category: 'templates',
    tags: ['gujarati', 'traditional', 'wedding', 'template', 'full-card'],
    description: 'Complete traditional Gujarati wedding card template with all standard sections. Just add your details!',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_8',
    driveCdrId: 'SAMPLE_CDR_ID_8',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },

  // Design Elements
  {
    title: 'Paisley Pattern Collection',
    slug: 'paisley-pattern-collection',
    category: 'elements',
    tags: ['paisley', 'pattern', 'indian', 'motif', 'decorative'],
    description: 'Collection of 10 traditional paisley patterns in vector format. Endless design possibilities.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_9',
    driveCdrId: 'SAMPLE_CDR_ID_9',
    formats: ['pdf', 'cdr'],
    featured: false,
    downloadCount: 0,
  },
  {
    title: 'Mandala Design Pack',
    slug: 'mandala-design-pack',
    category: 'elements',
    tags: ['mandala', 'circular', 'indian', 'decorative', 'spiritual'],
    description: 'Pack of 5 intricate mandala designs for backgrounds, corners, and decorative elements.',
    previewUrl: 'https://drive.google.com/thumbnail?id=PREVIEW_FILE_ID&sz=w400',
    drivePdfId: 'SAMPLE_PDF_ID_10',
    driveCdrId: 'SAMPLE_CDR_ID_10',
    formats: ['pdf', 'cdr'],
    featured: true,
    downloadCount: 0,
  },
];

/**
 * Seed the database with sample resources
 */
async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing resources (optional - comment out to append instead)
    console.log('🗑️  Clearing existing resources...');
    await Resource.deleteMany({});
    console.log('   Cleared!\n');

    // Insert sample resources
    console.log('📦 Inserting sample resources...');
    const inserted = await Resource.insertMany(sampleResources);
    console.log(`   Inserted ${inserted.length} resources\n`);

    // Log summary
    console.log('📊 Summary by category:');
    const categoryCounts = sampleResources.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   • ${cat}: ${count}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Note: Replace SAMPLE_*_ID values with actual Google Drive file IDs');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run seed
seedDatabase();
