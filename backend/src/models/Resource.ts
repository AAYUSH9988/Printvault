import mongoose, { Schema, Document, Model, CallbackError } from 'mongoose';
import slugify from 'slugify';
import type { ResourceCategory } from '../types/resource.js';

/**
 * Mongoose document interface
 */
export interface IResourceDocument extends Document {
  title: string;
  slug: string;
  category: ResourceCategory;
  tags: string[];
  description: string;
  previewUrl: string;
  drivePdfId?: string;
  driveCdrId?: string;
  driveAiId?: string;
  driveSvgId?: string;
  driveEpsId?: string;
  formats: string[];
  featured?: boolean;
  downloadCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Resource Schema - shared schema for all resource collections
 */
const resourceSchemaDefinition = {
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['bhagwan', 'frames', 'initials', 'templates', 'elements'],
    index: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  previewUrl: {
    type: String,
    required: true,
  },
  // Google Drive file IDs
  drivePdfId: { type: String },
  driveCdrId: { type: String },
  driveAiId: { type: String },
  driveSvgId: { type: String },
  driveEpsId: { type: String },
  // Available formats
  formats: [{
    type: String,
    enum: ['pdf', 'cdr', 'ai', 'svg', 'eps'],
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
};

const schemaOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

/**
 * Create schema with pre-save hooks
 */
function createResourceSchema(): Schema {
  const schema = new Schema(resourceSchemaDefinition, schemaOptions);

  // Auto-generate slug from title before saving
  schema.pre('save', function(next: (err?: CallbackError) => void) {
    const doc = this as unknown as IResourceDocument;
    if (doc.isModified('title') || !doc.slug) {
      doc.slug = slugify(doc.title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
    next();
  });

  // Text index for search
  schema.index({ title: 'text', description: 'text', tags: 'text' });

  return schema;
}

/**
 * Get or create model for a specific collection
 * Each category has its own collection for better organization
 */
const models: Record<string, Model<IResourceDocument>> = {};

export function getResourceModel(category: ResourceCategory): Model<IResourceDocument> {
  // Collection names: bhagwan_resources, frames_resources, etc.
  const collectionName = `${category}_resources`;
  
  if (!models[collectionName]) {
    const schema = createResourceSchema();
    models[collectionName] = mongoose.model<IResourceDocument>(
      collectionName,
      schema,
      collectionName // Explicit collection name
    );
  }
  
  return models[collectionName];
}

/**
 * Unified Resource model that can query across all collections
 * Uses the 'resources' collection as a unified view
 */
const UnifiedResourceSchema = createResourceSchema();
export const Resource = mongoose.models.Resource || 
  mongoose.model<IResourceDocument>('Resource', UnifiedResourceSchema, 'resources');

/**
 * Category-specific models for direct collection access
 */
export const BhagwanResource = mongoose.models.bhagwan_resources || 
  mongoose.model<IResourceDocument>('bhagwan_resources', createResourceSchema(), 'bhagwan_resources');

export const FramesResource = mongoose.models.frames_resources || 
  mongoose.model<IResourceDocument>('frames_resources', createResourceSchema(), 'frames_resources');

export const InitialsResource = mongoose.models.initials_resources || 
  mongoose.model<IResourceDocument>('initials_resources', createResourceSchema(), 'initials_resources');

export const TemplatesResource = mongoose.models.templates_resources || 
  mongoose.model<IResourceDocument>('templates_resources', createResourceSchema(), 'templates_resources');

export const ElementsResource = mongoose.models.elements_resources || 
  mongoose.model<IResourceDocument>('elements_resources', createResourceSchema(), 'elements_resources');

/**
 * Map category to model
 */
export const categoryModelMap: Record<ResourceCategory, Model<IResourceDocument>> = {
  bhagwan: BhagwanResource,
  frames: FramesResource,
  initials: InitialsResource,
  templates: TemplatesResource,
  elements: ElementsResource,
};

export default Resource;
