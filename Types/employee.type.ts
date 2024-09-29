export interface ISalaryRecord {
    salary: number;
    monthOfSalary: string;
    pf: number;
  }
  
  export interface IEmployee {
    id: string;
    age?: number;
    name: string;
    date: string ;
    country: string;
    region: string;
    gender: string;
    feedback?: string;
    salaryFields?: ISalaryRecord[]; 
    images?:string[];
    dob: Date | null;
  }
  