declare module "_/apollo/cache";

declare module "*/queries.graphql" {
  import { DocumentNode } from "graphql";
  const GetSite: DocumentNode;
  const GetSites: DocumentNode;
  const GetFlock: DocumentNode;
  const GetPage: DocumentNode;
  const IsUserLoggedIn: DocumentNode;
  const GetSiteQuery: DocumentNode;

  export { GetSite, GetSites, GetFlock, GetPage, IsUserLoggedIn, GetSiteQuery };

  export default defaultDocument;
}

declare module "*/mutations.graphql" {
  import { DocumentNode } from "graphql";
  const DeleteFlock: DocumentNode;
  const DeletePage: DocumentNode;
  const GetToken: DocumentNode;
  const CreateFlock: DocumentNode;
  const CreatePage: DocumentNode;
  const CreateSite: DocumentNode;
  const UploadFile: DocumentNode;
  const UpdateFlock: DocumentNode;
  const UpdatePage: DocumentNode;
  const Signup: DocumentNode;

  export {
    DeleteFlock,
    DeletePage,
    GetToken,
    CreateFlock,
    CreatePage,
    CreateSite,
    UploadFile,
    UpdateFlock,
    UpdatePage,
    Signup,
  };

  export default defaultDocument;
}
