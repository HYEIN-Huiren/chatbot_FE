export type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

export interface APIResponse {
    data: [];
    isSuccess: boolean;
    message: {
        code: string;
        description: string;
        details: string;
    };
    totalPages: number;
}

export type interfaceFileDownParams = {
    name: string;
};

export interface interfaceParams {
    type: Methods;
    url: string;
    payload?: object | interfaceFileParams;
}
