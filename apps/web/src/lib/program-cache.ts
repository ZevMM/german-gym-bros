export let cachedProgram: any = null;

export const setCachedProgram = (data: any) => {
    cachedProgram = data;
};

export const getCachedProgram = () => cachedProgram;
