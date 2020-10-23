type ColumnValue = string | Record<string, unknown> | { [key: string]: unknown } | unknown;

interface Column {
    id?: string;
    name: string;
    slug: string;
    field: string;
    value?: ColumnValue;
    columns: Column[];
    data?: ColumnValue;
    unsaved?: boolean;
    order: number;
    page_id?: number | null;
    __typename?: string;
}

interface Page {
    id: string;
    name: string;
    slug: string;
    columns?: Column[];
    site: Site;
    __typename: string;
}

interface Flock {
    id: string;
    name: string;
    slug: string;
    columns?: Column[];
    data?: any;
    site: Site;
    __typename: string;
}

interface APIKey {
    key: string;
}

interface Site {
    id: string;
    name : string;
    slug: string;
    pages?: Page[];
    flocks?: Flock[];
    owner?: {
        username: string;
    }
    apiKey?: APIKey[];
}

// UI Interfaces
interface Field {
    name: string;
    label: string | Node | JSX.Element;
    type?: string;
    value?: ColumnValue;
    onChange?(value: any): void;
    setValue?(name: string, value: any, config?: Record<string, unkown>): void;
}

interface FieldError {
    key: string | number;
    message: string;
    errorType: string;
}

// Hook Error
interface FloatError {
    key: number | string;
    message: string;
    errorType: string;
  }
