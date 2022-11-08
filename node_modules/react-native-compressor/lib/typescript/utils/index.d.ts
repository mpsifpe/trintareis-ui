export declare const AUDIO_BITRATE: number[];
declare type qualityType = 'low' | 'medium' | 'high';
declare type audioCompresssionType = {
    bitrate?: number;
    quality: qualityType;
    outputFilePath?: string | undefined | null;
};
export declare type defaultResultType = {
    outputFilePath: string | undefined | null;
    isCorrect: boolean;
    message: string;
};
export declare const DEFAULT_COMPRESS_AUDIO_OPTIONS: audioCompresssionType;
export declare type AudioType = {
    compress(value: string, options?: audioCompresssionType): Promise<string>;
};
export declare const generateFilePath: any;
export declare const getRealPath: any;
export declare const getVideoMetaData: any;
export declare const getDetails: (mediaFullPath: string, extesnion?: 'mp3' | 'mp4') => Promise<any | null>;
export declare const checkUrlAndOptions: (url: string, options: audioCompresssionType) => Promise<defaultResultType>;
export declare const uuidv4: () => string;
export {};
