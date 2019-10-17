type ImageBase<K extends string> = {
    image: K,
    imageId: string,
    title?: string,
    width?: number,
    height?: number,
};
export type ImageExternal = ImageBase<'external'> & {
    url: string,
};
export type ImageBuffer = ImageBase<'buffer'> & {
    base64: string,
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
