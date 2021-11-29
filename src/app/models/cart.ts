import { ArrayType } from "@angular/compiler";

export class Item{
    _id!: string
    productId!:string
    quantity!:number
    price!:number
    total!:number;
  }
  
export class Cart{
    _id!: string
    UserID!:string
    items: [Item]
    subTotal!:number
  }
  