export declare type InputType = 'base64' | 'uri';
export declare type OutputType = 'jpg' | 'png';
export declare type ReturnableOutputType = 'uri' | 'base64';
export declare type compressionMethod = 'auto' | 'manual';
export declare type CompressorOptions = {
    /***
     * The maximum width boundary used when compressing a landscape image.
     */
    compressionMethod?: compressionMethod;
    /***
     * The maximum width boundary used when compressing a landscape image.
     */
    maxWidth?: number;
    /***
     * The maximum height boundary used when compressing a portrait image.
     */
    maxHeight?: number;
    /***
     * The compression factor used when compressing JPEG images. Won't be used in PNG.
     */
    quality?: number;
    /***
     * The type of data the input value contains.
     */
    input?: InputType;
    /***
     * The output image type.
     */
    output?: OutputType;
    /***
     * The output that will return to user.
     */
    returnableOutputType?: ReturnableOutputType;
};
declare type ImageType = {
    compress(value: string, options?: CompressorOptions): Promise<string>;
};
declare const Image: ImageType;
export default Image;
