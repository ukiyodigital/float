interface Page {
    id: string;
    name: string;
    slug: string;
}

interface Flock {
    id: string;
    name: string;
    slug: string;
}

interface Site {
    id: string;
    name : string;
    slug: string;
    pages?: Page[];
    flocks?: Flock[];
}
