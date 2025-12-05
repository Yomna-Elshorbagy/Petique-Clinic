import { baseURL } from "./BaseUrl";
import axios from "axios";
import type { Order } from "../Types/OrderType";


export const getOrders = () => axios.get<Order[]>(`${baseURL}/orders`);




