export class Containers {
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
client:  string;
date: string;
id: number;
montant: number;
produit: string;
quantite: number;

}
