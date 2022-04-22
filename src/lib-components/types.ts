interface DocumentData {
    type: string;
    name: string;
    data: string;
    size: number;
}
  
interface FormContext {
    id: string;
    type: string;
}

export { FormContext, DocumentData };
  
  