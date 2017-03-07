#API
This is the documentation for the API. All API requests must be made to 
```http
/api/v1/
```

## HTTP Endpoints

### POST user/auth
> ####Description
> Returns a new token for the user to user for websocket connections and other things.
> ####POST params
> _username_ - the current user's username.
> _password_ - the current user's password.
> _ide_id_ - the ID of the IDE requesting the token.
> ####Returns
> ```json
> {
>   "token": "THE_USER_TOKEN",
>   "expires": Number
> }
> ```

### POST user/signup
> ####Description
> Creates a user and adds them to the Database, if their username and email are unique.
>
> ####POST params
> _username_ - the current user's username.
> _password_ - the current user's password.
> _email_ - the user's email.
>
> ####Returns
> ```json
> {
>   "token": "THE_USER_TOKEN",
>   "expires": Number
> }
> ```

## WebSocket Endpoints

All WebSocket messages are sent in the format 'EVENT'+'DELIMETER'+'DATA'
Where data is a JSON stringified message. The Delimeter can be found as a constant in the `routes/socket` file.

Additionally, all WebSocket requests must be accompanied by a valid token in the token GET parameter.

### 'list'
> #### Description
> This event is used to let the server know that you are a valid user. If this is not verified within 60s of joining, the server will forcefully close the socket.
> #### JSON Params
> _token_ - The token that you get from the HTTP server.
> #### Callback Events
> none.