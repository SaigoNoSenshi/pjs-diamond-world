import { Directory, File, Paths } from 'expo-file-system';

import type { AssetStore, StoredAsset } from '../interfaces';

type Folder = 'creations' | 'photos' | 'thumbnails';

/**
 * App-private asset storage using the SDK 57 File/Directory API. Everything lives
 * under the document directory, so it is backed up with the app and never exposed
 * to the shared camera roll.
 */
export class FileSystemAssetStore implements AssetStore {
  private readonly root: Directory;

  constructor(root: Directory = new Directory(Paths.document, 'pjs-diamond-world')) {
    this.root = root;
  }

  private folder(name: Folder): Directory {
    const dir = new Directory(this.root, name);
    if (!this.root.exists) this.root.create({ intermediates: true, idempotent: true });
    if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
    return dir;
  }

  async saveFromUri(sourceUri: string, folder: Folder, fileName: string): Promise<StoredAsset> {
    const target = new File(this.folder(folder), fileName);
    if (target.exists) target.delete();
    new File(sourceUri).copy(target);
    return { uri: target.uri, bytes: target.size ?? 0 };
  }

  async saveBase64(base64: string, folder: Folder, fileName: string): Promise<StoredAsset> {
    const target = new File(this.folder(folder), fileName);
    if (target.exists) target.delete();
    target.create();
    target.write(decodeBase64(base64));
    return { uri: target.uri, bytes: target.size ?? 0 };
  }

  async remove(uri: string): Promise<void> {
    const file = new File(uri);
    if (file.exists) file.delete();
  }

  async exists(uri: string): Promise<boolean> {
    return new File(uri).exists;
  }

  async totalBytes(): Promise<number> {
    if (!this.root.exists) return 0;
    return sumDirectory(this.root);
  }
}

function sumDirectory(dir: Directory): number {
  let total = 0;
  for (const entry of dir.list()) {
    if (entry instanceof Directory) total += sumDirectory(entry);
    else total += entry.size ?? 0;
  }
  return total;
}

/** Strips a data-URI prefix if present and decodes base64 to bytes (no Buffer dependency). */
export function decodeBase64(input: string): Uint8Array {
  const clean = input.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');
  const atobFn = (globalThis as { atob?: (s: string) => string }).atob;
  if (atobFn) {
    const bin = atobFn(clean);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i += 1) lookup[chars.charCodeAt(i)] = i;
  const len = clean.length;
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const out = new Uint8Array((len * 3) / 4 - padding);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const a = lookup[clean.charCodeAt(i)]!;
    const b = lookup[clean.charCodeAt(i + 1)]!;
    const c = lookup[clean.charCodeAt(i + 2)]!;
    const d = lookup[clean.charCodeAt(i + 3)]!;
    out[p++] = (a << 2) | (b >> 4);
    if (p < out.length) out[p++] = ((b & 15) << 4) | (c >> 2);
    if (p < out.length) out[p++] = ((c & 3) << 6) | d;
  }
  return out;
}
