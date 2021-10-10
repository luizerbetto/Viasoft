export interface MessageInterface {
    nameSender: string;
    nameReceiver: string;
    message: string;
    date: Date;
    id: string;
  }
  
  export interface DatabaseMessageInterface {
    nameSender: string;
    nameReceiver: string;
    message: string;
    date: Date;
    _id: string;
  }