// @flow
import BaseAPI from "./BaseAPI";


class API extends BaseAPI {
    user = {
        auth: (): Promise<APIData> => (
            this.fetchData(this.getUri("users/auth"))
        )
    }
}

export default API;
