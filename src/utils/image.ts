import { Image, BookNode, Book, ImageDic } from '../model';
import { processNodesAsync } from './bookNode';
import { mapSpan, imageSpan } from './span';

export type ImageProcessor = (image: Image) => Promise<Image>;
export async function processNodesImages(nodes: BookNode[], fn: (image: Image) => Promise<Image>): Promise<BookNode[]> {
    return processNodesAsync(nodes, {
        span: s => mapSpan(s, {
            image: async data => imageSpan(await fn(data)),
            default: async ss => ss,
        }),
    });
}

export async function processBookImages(book: Book, fn: ImageProcessor): Promise<Book> {
    if (book.meta.coverImage) {
        const processed = await fn(book.meta.coverImage);
        book = {
            ...book,
            meta: {
                ...book.meta,
                coverImage: processed,
            },
        };
    }
    book = {
        ...book,
        nodes: await processNodesImages(book.nodes, fn),
    };
    return book;
}

export async function storeImages(book: Book, fn: (buffer: Buffer, imageId: string) => Promise<string | undefined>): Promise<Book> {
    const store: {
        [key: string]: Image | undefined,
    } = {};

    return processBookImages(book, async image => {
        if (image.image === 'external') {
            return image;
        }
        const stored = store[image.imageId];
        if (stored !== undefined) {
            return stored;
        } else {
            const buffer = getImageBuffer(image, book.images);
            if (buffer === undefined) {
                return image;
            }
            const url = await fn(buffer, image.imageId);
            if (url !== undefined) {
                const result: Image = {
                    ...image,
                    image: 'external',
                    url,
                };
                store[image.imageId] = result;
                return result;
            } else {
                return image;
            }
        }
    });
}

function getImageBuffer(image: Image, images: ImageDic): Buffer | undefined {
    if (image.image === 'buffer') {
        return image.buffer;
    } else {
        const resolved = images[image.imageId];
        if (resolved !== undefined && resolved.image === 'buffer') {
            return resolved.buffer;
        } else {
            return undefined;
        }
    }
}
