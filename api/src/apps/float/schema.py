import graphene
import graphql_jwt

import apps.sites.schema
import apps.users.schema


class Query(
        apps.users.schema.Query,
        apps.sites.schema.Query,
        graphene.ObjectType,
    ):
    pass

class Mutation(
        apps.users.schema.Mutation,
        apps.sites.schema.Mutation,
        graphene.ObjectType,
    ):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
