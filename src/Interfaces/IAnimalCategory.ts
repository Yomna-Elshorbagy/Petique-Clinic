export interface IAnimalCategory {
    _id: string;
    name: string;
    image?: {
        secure_url: string;
        public_id: string;
    };
    petCount?: number; 
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
