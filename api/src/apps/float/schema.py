import graphene
import graphql_jwt

import apps.users.schema
import apps.sites.schema
import apps.pages.schema
import apps.flocks.schema


class Query(
        apps.users.schema.Query,
        apps.sites.schema.Query,
        apps.pages.schema.Query,
        apps.flocks.schema.Query,
        graphene.ObjectType,
    ):
    pass

class Mutation(
        apps.users.schema.Mutation,
        apps.sites.schema.Mutation,
        apps.pages.schema.Mutation,
        apps.flocks.schema.Mutation,
        graphene.ObjectType,
    ):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
