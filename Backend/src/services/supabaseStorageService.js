import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

const getStorage = () => {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET;

  if (!url || !serviceRoleKey || !bucket)
    throw new Error(
      'Supabase storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_BUCKET.',
    );

  return createClient(url, serviceRoleKey).storage.from(bucket);
};

const createSignedUrl = async (path, options = {}) => {
  const storage = getStorage();
  const { data, error } = await storage.createSignedUrl(
    path,
    60 * 60 * 24 * 7,
    options,
  );
  if (error) throw error;
  return data.signedUrl;
};

const uploadBuffer = async (file, folder) => {
  const storage = getStorage();
  const extension = extname(file.originalname).toLowerCase();
  const path = `${folder}/${randomUUID()}${extension}`;
  const { data, error } = await storage.upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) throw error;

  return {
    publicId: data.path,
    resourceType: file.mimetype.startsWith('image/') ? 'image' : 'raw',
    format: extension.slice(1),
    bytes: file.buffer.length,
  };
};

const removeObjects = async (paths) => {
  if (!paths.length) return;
  const storage = getStorage();
  const { error } = await storage.remove(paths);
  if (error) throw error;
};

export const uploadDriverAvatar = async (file) => {
  const result = await uploadBuffer(file, 'driver-avatars');
  return {
    publicId: result.publicId,
    resourceType: result.resourceType,
    format: result.format,
  };
};

export const deleteDriverAvatar = async (path) => removeObjects([path]);

export const getDriverAvatarUrl = (path) => createSignedUrl(path);

export const uploadApplicationDocuments = async (filesByField = {}) => {
  const files = Object.entries(filesByField).flatMap(([field, items]) =>
    items.map((file) => ({ field, file })),
  );
  if (!files.length) return [];

  const results = await Promise.allSettled(
    files.map(async ({ field, file }) => ({
      field,
      originalName: file.originalname,
      ...(await uploadBuffer(file, 'driver-applications')),
    })),
  );

  const uploaded = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
  const failed = results.find((result) => result.status === 'rejected');

  if (failed) {
    await removeObjects(uploaded.map((document) => document.publicId));
    throw failed.reason;
  }

  return uploaded;
};

export const deleteApplicationDocuments = async (documents = []) =>
  removeObjects(documents.map((document) => document.publicId));

export const getApplicationDocumentDownloadUrl = (document) =>
  createSignedUrl(document.publicId, { download: document.originalName });

export const getApplicationDocumentViewUrl = (document) =>
  createSignedUrl(document.publicId);
