"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.createResource = exports.downloadResource = exports.getResources = void 0;
const Resource_1 = require("../models/Resource");
const getResources = async (req, res, next) => {
    try {
        const { category, search, fileFormat } = req.query;
        const query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        if (fileFormat && fileFormat !== 'All') {
            query.fileFormat = fileFormat;
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ title: searchRegex }, { description: searchRegex }];
        }
        const resources = await Resource_1.Resource.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: resources,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getResources = getResources;
const downloadResource = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resource = await Resource_1.Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        resource.downloadCount += 1;
        await resource.save();
        res.json({
            success: true,
            message: 'Download incremented',
            data: {
                fileUrl: resource.fileUrl,
                downloadCount: resource.downloadCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.downloadResource = downloadResource;
const createResource = async (req, res, next) => {
    try {
        const resourceData = req.body;
        if (req.user) {
            resourceData.createdById = req.user._id;
        }
        const resource = await Resource_1.Resource.create(resourceData);
        res.status(201).json({
            success: true,
            message: 'Resource created successfully',
            data: resource,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createResource = createResource;
const updateResource = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resource = await Resource_1.Resource.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        res.json({
            success: true,
            message: 'Resource updated successfully',
            data: resource,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateResource = updateResource;
const deleteResource = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resource = await Resource_1.Resource.findByIdAndDelete(id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        res.json({
            success: true,
            message: 'Resource deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteResource = deleteResource;
