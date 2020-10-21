declare module '_/apollo/cache';

declare module '*/queries.graphql' {
    import { DocumentNode } from 'graphql';
    const GetSites: DocumentNode;

    export { GetSites };

    export default defaultDocument;
}

declare module '*/mutations.graphql' {
    import { DocumentNode } from 'graphql';
    const GetToken: DocumentNode;

    export { GetToken };

    export default defaultDocument;
}
