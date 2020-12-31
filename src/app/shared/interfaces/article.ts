export interface Article {
  cover: any;
  artists: Artist[];
  content: string;
  created: boolean;
  created_at: Date;
  created_by: any; // todo User interface
  id: number;
  name: string;
  published: Date;
  status: string; // create status enum
  tags: Tag[];
  title: null;
  tracks: Track[];
  updated_at: Date;
  updated_by: any; // todo User interface
}

export interface Artist {
  Described: boolean;
  Top100: number;
  created_at: Date;
  created_by: any; // todo User interface
  displayName: string;
  id: number;
  updated_at: Date;
  updated_by: any; // todo User interface
  value: string;
}

export interface Tag {
  Type: string; // todo create type enum
  created_at: Date;
  created_by: any; // todo User interface
  displayValue: string;
  id: number;
  updated_at: Date;
  updated_by: any; // todo User interface
  value: string;
}

export interface Track {
  Duration: number;
  Title: 'In the Court of the Crimson King';
  album: any; // todo Album interface
  created_at: Date;
  created_by: any; // todo User interface
  id: number;
  updated_at: Date;
  updated_by: any; // todo User interface
}
