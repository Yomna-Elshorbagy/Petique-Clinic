export type productdetails = {
  _id: string;
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  imageCover: { secure_url: string; };
  subImages: { secure_url: string; }[];
  stock: number;
  rate: number;
  category: { name: string; };
};

export type review = {
  _id: string;
  comment: string;
  rate: number;
  user: {
    _id: string;
    userName: string;
    id: string;
  };
  product: {
    _id: string;
    title: string;
  }
}
export type Users = {
  _id: string;
  userName: string;
  email: string;
  image: { secure_url: string; }
}