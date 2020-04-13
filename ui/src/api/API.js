import BaseAPI from './BaseAPI';

class API extends BaseAPI {
    user = {
      auth: () => (
        this.fetchData(this.getUri('users/auth'))
      ),
    };
}

export default API;
