export interface Client{
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateEnreg: string;
}
export interface Produit{
  nom: string;
  categorie: string;
  packaging: string[];

}

export class User {
  constructor(
    public username: string,
    public password: string,

  ){}
}

export class Token{
  constructor(private token: string){}
}


export interface Facture{
client:  number;
date: string;
id: number;
montant: number;
produit: number;
quantite: number;
packaging: string;

}


export interface UpdateFacture{
  id: number;
  quantite: number;
}
