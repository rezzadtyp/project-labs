export interface LibraryReference {
  name: string;
  url: string;
}

export interface Library {
  name: string;
  description: string;
  url: string;
  componentName: string;
  references: LibraryReference[];
  imageUrl: string;
}

export interface LibrariesData {
  libraries: Library[];
}

