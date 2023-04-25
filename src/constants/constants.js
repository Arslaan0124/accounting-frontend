export const BASE_URL = 'http://127.0.0.1:8000/';
// export const BASE_URL = 'https://arslantariqdev.pythonanywhere.com/';
export const auth = {
    currentUser: 'user',
    accessToken: 'access',
    refreshToken: 'refresh'
};

export const themes = {
    LIGHT: 'light',
    DARK: 'dark'
};

export const languages = {
    URDU: 'ur',
    ENGLISH: 'en'
};

export const uploadStates = {
    intialUploadState: { status: 'UINTIALIZED', message: '' },
    successUploadState: {
        status: 'SUCCESS',
        message: 'Successfully uploaded'
    },
    errorUploadState: {
        status: 'ERROR',
        message: 'Upload failed'
    }
};
