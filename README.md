# Music TS GraphQL

# Features

-   Song and album management
-   Comment addition and rating
-   Information retrieval

# Stack

This project is built using the following technologies:

-   **Language**: TypeScript (Type-safe superset of JavaScript)
-   **Database**: Prisma (ORM for database access)
-   **Web Framework**: Fastify (High-performance web framework)
-   **GraphQL Library**: Apollo Server (GraphQL implementation)
-   **Testing**: Jest (Testing framework)
-   **Code Quality**: ESLint (Linting), Prettier (Code formatting)

## Authentication

Authentication is done through an Authorization Header using a token. The token can be obtained by calling the login and register mutations.

Once the token is obtained, it needs to be included in the Authorization Header of all subsequent GraphQL requests. The app validates the token and restricts access to certain mutations and queries based on the token's permissions.

Some mutations and queries require higher privileges, such as a specific role, to be executed. These operations can only be performed by users with the required privileges.

Example Header:

```
Authorization: <token>
```

## File upload

This app supports file upload through a dedicated endpoint at `/upload/<type>/<name-prefix>.extension`. If the uploaded file is an image it will be resized to a specific size based on the chosen type. Currently, the supported types and sizes are:

-   `cover`: { width: 600, height: 600 }
-   `avatar`: { width: 600, height: 600 }

To upload a file, you should make a POST request to the `/upload/<type>/<name-prefix>` endpoint with the file contents as the request body. The request body should be a binary file, not multipart form data.

The `<type>` parameter specifies the type of the uploaded file, while the `<name-prefix>` parameter is used to generate a unique filename for the uploaded file. The uploaded file will be resized and saved to the server, and the response will contain a JSON object with the URL of the uploaded file. For example:
additionally there is a route to upload Musics
something like : `/upload/music/<name-prefix>.mp3`

Example curl request:

```
curl http://localhost:3000/upload/music/something.mp3 -F "file=@y.mp3" -H 'Authorization: <token>'
```

```
{"url":"/poster/testtt-cliiy9tkb000015ln9byqftw4.jpeg"}
```

You can use the returned URL wherever a file is required in your application.

# Usage

To use this project, follow these steps:

1. Clone this repository:

    ```bash
    git clone https://github.com/basemax/MusicTSGraphQL
    ```


2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the app using Docker Compose:

   ```bash
   sudo docker compose -p ci -f docker-compose.base-dev.yml -f docker-compose.dev.yml up --build
   ```

    This will start the app in development mode, with hotreloading enabled. The GraphQL playground will be available at [http://localhost:3000/graphql. ↗](http://localhost:3000/graphql.)

4. Attach to the container:

    ```bash
    sudo docker exec -it ci-app-1 bash
    ```

5. Create an admin account:

   ```bash
   node dist/create-admin.js
   ```

    It will prompt you for an email, password, and name to create the superuser account.

## Testing

Run the following command:

```bash
sudo ./test.sh
```

It will automatically do everything and exit with 0 status if everything work well

## Examples

Here are some example GraphQL queries:

1. Query all genres:

    ```graphql
    query {
        genres {
            id
            name
        }
    }
    ```

2. Query a specific album:

    ```graphql
    query {
        album(id: "<album_id>") {
            id
            title
            releaseDate
            cover
            musics {
                id
                name
                duration
            }
        }
    }
    ```

3. Query all unapproved comments:

    ```graphql
    query {
        unapprovedComments(pagination: { limit: 10 }) {
            id
            text
            isApproved
            user {
                id
                name
            }
            music {
                id
                name
            }
        }
    }
    ```

4. Create a new album:

    ```graphql
    mutation {
        createAlbum(input: {
            title: "New Album",
            cover: "...",
            releaseDate: "2021-07-12",
            musics: ["<music_id_1>", "<music_id_2>"]
        }) {
            id
            title
            releaseDate
            cover
            musics {
                id
                name
                duration
            }
        }
    }
    ```

5. Update an existing album:

    ```graphql
    mutation {
        updateAlbum(input: {
            id: "<album_id>",
            title: "Updated Album",
            cover: "...",
            releaseDate: "2021-07-15",
            musics: ["<music_id_1>", "<music_id_2>", "<music_id_3>"]
        }) {
            id
            title
            releaseDate
            cover
            musics {
                id
                name
                duration
            }
        }
    }
    ```

6. Delete a comment:


   ```graphql
   mutation {
       deleteComment(id: "<comment_id>")
   }
   ```

## API Documentation

The following table describes all the mutations and queries available in the API:

| Query/Mutation                                   | Description                                   |
| ------------------------------------------------ | --------------------------------------------- |
| `album(id: String!)`                               | Query a specific album by its ID              |
| `genres`                                           | Query all genres                              |
| `genre(id: String!)`                               | Query a specific genre by its ID              |
| `music(id: String!)`                               | Query a specific song by its ID               |
| `searchAlbums(input: SearchAlbumInput!)`           | Search for albums based on specific criteria  |
| `searchMusic(input: SearchMusicInput!)`            | Search for songs based on specific criteria   |
| `searchSingers(input: SearchSingerInput!)`         | Search for singers based on specific criteria |
| `singer(id: String!)`                              | Query a specific singer by its ID             |
| `unapprovedComments(pagination: PaginationInput!)` | Query all unapproved comments                 |
| `user`                                             | Query the current user                        |
| `approveComment(id: String!)`                      | Approve a specific comment                    |
| `changeRole(role: UserRole!, userId: String!)`     | Change the role of a specific user            |
| `createAlbum(input: CreateAlbumInput!)`            | Create a new album                            |
| `createComment(input: CreateCommentInput!)`        | Create a new comment                          |
| `createGenre(input: CreateGenreInput!)`            | Create a new genre                            |
| `createMusic(input: CreateMusicInput!)`            | Create a new song                             |
| `createSinger(input: CreateSingerInput!)`          | Create a new singer                           |
| `deleteComment(id: String!)`                       | Delete a specific comment                     |
| `deleteMusic(id: String!)`                         | Delete a specific song                        |
| `deleteSinger(id: String!)`                        | Delete a specific singer                      |
| `login(input: LoginUserInput!)`                    | Log in a user                                 |
| `register(input: RegisterUserInput!)`              | Register a new user                           |
| `updateAlbum(input: UpdateAlbumInput!)`            | Update an existing album                      |
| `updateComment(input: UpdateCommentInput!)`        | Update an existing comment                    |
| `updateGenre(input: UpdateGenreInput!)`            | Update an existing genre                      |
| `updateMusic(input: UpdateMusicInput!)`            | Update an existing song                       |
| `updateSinger(input: UpdateSingerInput!)`          | Update an existing singer                     |

## License

This project is licensed under the GPL-3 license. Contributions are welcome, please follow the guidelines in the CONTRIBUTING.md file.

Copyright 2023, Max Base
