export type AuthToken = {
    token: string,
};

export type AccountInfo = {
    _id: string,
    name: string,
    pictureUrl?: string,
    joined: Date,
};
