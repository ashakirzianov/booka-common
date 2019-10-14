type ImageBase<K extends string> = {
    image: K,
    imageId: string,
    title?: string,
};
export type ImageExternal = ImageBase<'external'> & {
    url: string,
};
export type ImageBuffer = ImageBase<'buffer'> & {
    buffer: Buffer,
};
export type ImageRef = ImageBase<'ref'>;
export type Image =
    | ImageRef
    | ImageExternal
    | ImageBuffer
    ;

export type ImageDic = {
    [k in string]: Image | undefined;
};