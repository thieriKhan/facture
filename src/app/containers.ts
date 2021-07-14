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
