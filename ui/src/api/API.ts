import BaseAPI from "./BaseAPI";

class API extends BaseAPI {
    public user = {
        auth: () => (
            this.fetchData(this.getUri("users/auth"))
        ),
    };
}

export default API;
