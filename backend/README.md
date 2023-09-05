# Sync database using `sqlc`

 `sqlc` is a tool that generates type safe Go code from SQL.

 To install `sqlc`:

 ```bash
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
 ```

 To generate code:

 ```bash
 sqlc generate
 ```

 To watch for changes and regenerate code:

 ```bash
 sqlc generate -w
 ```

 To run tests:

 ```bash
 sqlc test
 ```