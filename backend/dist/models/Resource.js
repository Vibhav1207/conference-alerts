"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
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
    createdById: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Resource = (0, mongoose_1.model)('Resource', ResourceSchema);
