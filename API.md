#API
This is the documentation for the API. All API requests must be made to 
```http
/api/v1/
```

## HTTP Authentication Endpoints

### POST user/auth
> ####Description
> Returns a new token for the user to user for websocket connections and other things.
> ####POST params
> _username_ - the current user's username.
>
> _password_ - the current user's password.
>
> _ide_id_ - the ID of the IDE requesting the token.
> ####Returns
> ```json
> {
>   "token": "THE_USER_TOKEN",
>   "expires": Number
> }
> ```

### POST user/login
> ####Description
> Similar to user/auth, this registers a token and puts it as the users cookie, essentially creating a session.
> ####POST params
> _username_ - the current user's username.
>
> _password_ - the current user's password.
> ####Returns
> ```json
> {
>   "good": "Wonderful, you logged in."
> }
> ```


### POST user/signup
> ####Description
> Creates a user and adds them to the Database, if their username and email are unique.
>
> ####POST params
> _username_ - the current user's username.
>
> _password_ - the current user's password.
>
> _email_ - the user's email.
>
> ####Returns
> ```json
> {
>   "good": "Wonderful, you logged in."
> }
> ```


## HTTP Data Endpoints
All these endpoints assume the user is logged in or a token must be provided.


### GET /repos
> ####Description
> Grabs every repo object associated with the caller.
>
> ####GET params
> _token_ - the token you get /auth
>
> ####Returns
> ```json
> {
>   "repos": [
>     {REPO_OBJECT}
>   ]
> }
> ```




## WebSocket Endpoints

All WebSocket messages are sent in the format 'EVENT'+'DELIMETER'+'DATA'
Where data is a JSON stringified message. The Delimeter can be found as a constant in the `routes/socket` file.

Additionally, all WebSocket requests must be accompanied by a valid token in the token GET parameter.

### 'send'
> #### Description
> This event sends data to the the 
> #### JSON Params
> _to_ - the id of the person you're sending data to.
>
> _data_ - some sort of data you want to send them.
>
> #### Callback Events
> none.

### 'list'
> #### Description
> This gets the list of all the users in the repo.
> #### JSON Params
> _repo_ - the id of the repository you want the list of.
>
> #### Callback Events
> none.