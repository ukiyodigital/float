type ColumnValue = string | { [key: string]: string | ColumnValue | unknown } | unknown;

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
    flock_id?: number | null;
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
    data?: Item[];
    site: Site;
    __typename: string;
}

interface Item {
    id: string | number;
    [key: string]: Item | ColumnValue | unknown;
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
    onChange?(value: string | unknown): void;
    setValue?(name: string, value: unknown, config?: Record<string, unkown>): void;
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
