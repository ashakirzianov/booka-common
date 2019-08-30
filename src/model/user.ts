export type AuthToken = {
    token: string,
};

export type UserInfo = {
    _id: string,
    name: string,
    pictureUrl?: string,
};

export type UserBooks = {
    books: string[],
};
