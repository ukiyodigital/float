from graphql import GraphQLError

def check_authentication(user=None):
    """
    Helper function to check if user successfully
    authenticated through JWT and returns user if succeeded
    """
    if not user or user.is_anonymous:
        raise GraphQLError('You are not logged in')
    return user
