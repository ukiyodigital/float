class BaseAPI {
    private csrftoken: string = "";

    private apiUrl = process.env.API_URL;

    public fetchData(input: string, init: any = this.requestInit()) {
        return fetch(input, init)
            .then((response) => {
                this.csrftoken = response.headers.get("X-CSRFTOKEN");

                // throw error if response is not ok
                if (!response.ok) {
                    throw response;
                }

                // throw error if response data is not in JSON format
                const contentType = response.headers.get("Content-Type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Returned data is not in JSON format.");
                }

                return response.json();
            });
    }

    public downloadFile(location: string, requestType: string = "GET", body?: object) {
        const form = window.document.createElement("form");

        form.target = "_blank";
        form.action = this.getUri(location);
        form.method = requestType;

        if (body) {
            Object.entries(body).forEach(([key, val]) => {
                const input = window.document.createElement("input");
                input.name = key;
                input.value = val;
                form.appendChild(input);
            });
        }

        window.document.body.appendChild(form);
        form.submit();
        form.parentNode.removeChild(form);
    }

    public getUri(location: string, version: string = "v1.0") {
        if (!this.apiUrl) {
            throw new Error("API_URL is not defined.");
        }
        return `${this.apiUrl}/api/${version}/${location}`;
    }

    private requestInit(requestType: string = "GET", body?: any, cors: boolean = true): object {
        const init: any = {
            headers: {"Content-Type": "application/json"},
            method: requestType,
        };

        if (cors) {
            init.mode = "cors";
            init.credentials = "include";
        }

        if (body) {
            init.body = JSON.stringify(body);
        }

        if (["POST", "PUT", "PATCH", "DELETE"].includes(requestType)) {
            init.headers["X-CSRFTOKEN"] = this.csrftoken;
        }

        return init;
    }
}

export default BaseAPI;
