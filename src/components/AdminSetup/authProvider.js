const apiUrl = "http://localhost:5000";

export default {
  // called when the user attempts to log in
  login: ({ username }) => {
    // console.log("authprovider.login(): ", username, password)
    // const request = new Request(`${apiUrl}/Customers/login`, {
    //   method: 'POST',
    //   body: JSON.stringify({ username, password }),
    //   headers: new Headers({ 'Content-Type': 'application/json' }),
    // });
    // return fetch(request)
    // .then(response => {
    //     if (response.status < 200 || response.status >= 300) {
    //         throw new Error(response.statusText);
    //     }
    //     return response.json();
    // })
    // .then(({ token }) => {
    //     localStorage.setItem('token', token);
    // });

    // accept all username/password combinations
    return Promise.resolve();
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("username")
      ? Promise.resolve()
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
