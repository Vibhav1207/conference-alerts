import { Schema, model, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  category: 'LaTeX Template' | 'Word Template' | 'Presentation Deck' | 'Journal Indexing Guide' | 'Publishing Guideline';
  description: string;
  fileFormat: 'PDF' | 'ZIP' | 'DOCX' | 'TEX' | 'PPTX';
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  createdById?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true, index: true },
    category: {
      type: String,
      enum: ['LaTeX Template', 'Word Template', 'Presentation Deck', 'Journal Indexing Guide', 'Publishing Guideline'],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    fileFormat: {
      type: String,
      enum: ['PDF', 'ZIP', 'DOCX', 'TEX', 'PPTX'],
      default: 'PDF',
    },
    fileUrl: { type: String, required: true },
    fileSize: { type: String, default: '1.2 MB' },
    downloadCount: { type: Number, default: 0 },
    createdById: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Resource = model<IResource>('Resource', ResourceSchema);
