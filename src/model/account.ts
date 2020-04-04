export type AuthToken = {
    token: string,
};

export type AccountInfo = {
    _id: string,
    name: string,
    pictureUrl?: string,
    joined: Date,
};

export type NotSignedState = { sign: 'not-signed' };
export type SignedState = {
    sign: 'signed',
    token: AuthToken,
    accountInfo: AccountInfo,
};
export type SignState = NotSignedState | SignedState;
