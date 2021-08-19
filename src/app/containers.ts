export interface Client{
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}
export interface Produit {
 id: string;
 availableContainerQuantity: number;
 availablePieceQuantity: number;
 pieceSalePrice: number;
 containerSalePrice: number;
 pictureUrl: string;
 code: string;
 name: string;
 pieceUnits: string;
 containerUnits: string;
 isTaxable: boolean;
 packagingName: string;
 packagingSymbol: string;
 packagingHoles: number;
 isRecyclablePackaging: boolean;
}



export interface ClientOrder{
  idClient: string;
  orders: Order[];
}
export class User {
  constructor(
    public phone: string,
    public code: string

  ){}
}

export class Token{
  constructor(private token: string){}
}


export interface Facture   {
  id: string;
  totalHT: number;
  totalTTC: number;
  totalTVA: number;
  vat: number;
  reference: string;
  paidAmount: number;
  isMecefInvoiceGenerated: boolean;
  mecefReference: string;
  mecefQrCodeData: string;
  mecefNIM: string;
  mecefCounter: string;
  mecefDate: string;
  status: string;
  paymentStatus: string;
  paymentMode: string;
  comment: string;
  createdBy: number;
  updatedBy: string;
  customer: Client;
  createdAt: string;
  updatedAt: string;
  orderItems: Order[];
}

export interface Order{
 id: string ;
 containerQuantity: number;
 pieceQuantity: number ;
}


export interface UpdateFacture{
  id: number;
  quantite: number;
}
