export default class HttpUtil {
    static get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(response.status + " : " + response.statusText);
                    }
                })
                .then(result => resolve(result))
                .catch(error => {
                    reject(error);
                })
        });
    }

    static post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                //redirect: 'manual',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    } else {
                        return response.json()
                    }
                })
                .then(result => resolve(result))
                .catch(error => {
                    reject(error);
                })
        })
    }
    static put(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    reject(error);
                })
        })
    }

    static delete(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    reject(error);
                })
        })
    }
}
