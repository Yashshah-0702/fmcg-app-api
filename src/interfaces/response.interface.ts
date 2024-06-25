export interface ResponseData {
    message: string;
    status: string;
    code: number;
    data?: Object; // Adjust this type according to the expected structure of 'data'
  }