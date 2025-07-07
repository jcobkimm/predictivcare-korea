// src/types/index.ts

export type DNAStatusKey =
  | 'Awaiting Sample'
  | 'Sample Received'
  | 'Sample Extracted'
  | 'DNA Sequenced'
  | 'DNA Analyzed'
  | 'Building Digital Twin'
  | 'Awaiting Genetic Counseling'
  | 'Not reachable'
  | 'Completed'
  | 'Analyzing';

export interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dnaStatus: DNAStatusKey;
  dnaId: string;
  age?: number;
  height?: string;
  weight?: string;
  ethnicity?: string;
  occupation?: string;
  healthSummary?: string;
  dob?: string;
  biologicalSex?: string;
  phoneNumber?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}