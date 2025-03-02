export  interface IregisterInput {
  name: "username" | "email" | "password";
  placeholder: string;
  type: string;
  validation: {
    // required: {
    //   value: boolean;
    //   message: string;
    // };
    // minLength?: {
    //   value: number;
    //   message: string;
    // };
    // maxLength?: {
    //   value: number;
    //   message: string;
    // };
    // pattern?: {
    //   value: RegExp;
    //   message: string;
    // };
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}


export interface IloginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}


export interface IErrorResbonse {
  error:{
    details?:{
      errors:{
        message: string;
      }[]
    };
    message: string;
  }
}

export interface ITodo {
  id:number;
  documentId: string;
  title: string;
  complete: boolean;
}