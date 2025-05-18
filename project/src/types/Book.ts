export enum BookCategory {
  Fiction = 'Fiction',
  NonFiction = 'Non-Fiction',
  ScienceFiction = 'Science Fiction',
  Fantasy = 'Fantasy',
  Biography = 'Biography',
  Poetry = 'Poetry',
  History = 'History',
  Romance = 'Romance',
  Mystery = 'Mystery'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  price: string;
  numericPrice: number;
  isbn: string;
  category: BookCategory;
  publishDate: string;
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
}

export const priceRanges: PriceRange[] = [
  { min: 0, max: 50000, label: 'Under 50.000 COP' },
  { min: 50000, max: 100000, label: '50.000 - 100.000 COP' },
  { min: 100000, max: 150000, label: '100.000 - 150.000 COP' },
  { min: 150000, max: Infinity, label: 'Over 150.000 COP' }
];