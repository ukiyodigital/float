import graphene

from graphene_django import DjangoObjectType

from graphql import GraphQLError
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token

from apps.users.models import User

class UserType(DjangoObjectType):
    class Meta:
        model = User

class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    me = graphene.Field(UserType)

    @login_required
    def resolve_user(self, info, id):
        return User.objects.get(id=id)

    @login_required
    def resolve_me(self, info):
        return info.context.user

class CreateUser(graphene.Mutation):
    token = graphene.Field(graphene.String)

    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, first_name, last_name, username, password, email):
        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
        )

        user.set_password(password)
        user.save()
        token = get_token(user)
        return CreateUser(token=token)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
