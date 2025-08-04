export interface MenuResponseDto {
    _id: string;
    name: string;
    image?: string;
    description: string;
    price: number;
    storeId: string;
    createdAt: string;
    updatedAt: string;
}

export interface MenuRegistrationRequest {
    name: string;
    image?: string;
    description: string;
    price: number;
    storeId: string;
}
