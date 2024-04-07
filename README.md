# BlogTaggingSystem


### Authentication

- Added user authentication functionality with sign-up and sign-in endpoints to manage user accounts.
- Implemented JSON Web Tokens (JWT) for token-based authentication, providing secure access to protected endpoints.
- Enhanced user authentication by including role-based access control (RBAC), distinguishing between regular users and admins.

### Blog Management

- Implemented endpoints for adding, retrieving, and deleting blog posts to facilitate content management.
- Ensured that blog posts include essential details such as title, content, author information, creation timestamp, and associated tags.
- Enabled optional authentication for retrieving blog posts, ensuring privacy and security for user-generated content.

### Tagging System

- Developed a tagging system allowing users to add, edit, and delete tags for their blog posts.
- Established a many-to-many relationship between blog posts and tags, enabling flexible categorization of content.
- Enhanced search functionality by enabling filtering blog posts based on tags, date range, and author.

### Error Handling and Validation

- Improved error handling mechanisms for API endpoints, including validation errors for user input and authorization errors for restricted actions.
- Implemented input validation and sanitization for user-provided data, enhancing security and preventing malicious activities.
- Optimized search queries for performance using Sequelize query optimization techniques, ensuring efficient retrieval of relevant data.




## Technologies Used

Node.js, Express.js, Sequelize, MySQL, JSON Web Tokens (JWT), and for unit testing - Mocha, Chai etc.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bhav380-2/blogTaggingSystemAPI.git
2. Navigate to the project:
   ```bash
   cd /path_to_projectDirectory
3. Install dependences:
   ```bash
   npm install


## Database Configuration

Ensure you have MySQL installed and running on your local machine. Modify the `config.json` file in the `config` directory with your database credentials based on the environments development, test, production:

  ```json
  {
    "username": "databaseUser",
    "password": "password",
    "database": "databaseName",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  ```



## Testing

The project includes unit tests written using Mocha and Chai. To run the tests, ensure that you have completed the installation steps and configured the database for the test environment. Then, use the following command:

  ```bash
  npm test
  ```


## Usage

To use this application, follow the steps below:

### Base URL

- The base URL for all API endpoints is `https://localhost.com/api/v1`

### Authentication Endpoints

1. **SignUp:**
     - Create a new user account.
     - Endpoint: `POST /auth/signup`
     - Request Body:
       ```json
       {
         "name": "user", //name should have atleast 3 character
         "email": "user@example.com",  
         "password": "password123"  //password should have atleast 8 chars
       }
       ```
     - Response (Status 201 Created):
       ```json
      
        {
            "status": true,
            "content": {
                "data": {
                    "id": 1,
                    "name": "user",
                    "email": "user@example.com",
                    "created_at": "2024-04-06T03:46:26.085Z"
                },
                "meta": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjksImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcxMjM3NTE4NiwiZXhwIjoxNzEyMzc4Nzg2fQ.SS_mODVpMkWoql9hyB0xHP0bEktPLVT-S-lyFBUC3mY"
                }
            }
        }

       ```

   - Response (Status 400 Bad Request):
       ```json
        {
            "status": false,
            "message": "User with this email address already exists"
        }
       ```

2. **SignIn:**
     - Authenticate a user by sending a POST request to the `/auth/signin` endpoint.
     - Endpoint: `POST /auth/signin`
     - Request Body:
       ```json
       {
         "email": "user@example.com",   
         "password": "password123"  
       }
       ```

     - Response (Status 200 OK):
       ```json
       {
          "status": true,
          "content": {
              "data": {
                  "id": 1,
                  "name": "user",
                  "email": "user@example.com",
                  "created_at": "2024-04-06T03:46:26.000Z"
              },
              "meta": {
                  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjksImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcxMjM3NTU4OCwiZXhwIjoxNzEyMzc5MTg4fQ.0N_Q8E54eRFSuAiejM0k445kGMWLFJAKJm6RkWYEbQM"
              }
          }
       }
       ```

    - Response (Status 401 Unauthorized):
       ```json
       {
          "status": false,
          "error": {
              "message": "Invalid email/password"
          }
       }
       ```


### Blog Endpoints

1. **Add Blog:**
     - Create a new Blog.
     - Endpoint: `POST /blog/add`
     - Request Body:
       ```json
       {
         "title": "New Blog",   
         "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",  
       }
       ```
     - Authentication: Required (Bearer token)
     - Response (Status 201 Created):
       ```json
       {
          "success": true,
          "content": {
              "data": {
                  "id": 1,
                  "title": "New Blog",
                  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                  "UserId": 1,
                  "updatedAt": "2024-04-06T04:06:06.525Z",
                  "createdAt": "2024-04-06T04:06:06.525Z",
                  "author": {
                      "id": 1,
                      "name": "user",
                      "email": "user@example.com",
                      "role": "user",
                      "createdAt": "2024-04-06T03:46:26.000Z",
                      "updatedAt": "2024-04-06T03:46:26.000Z"
                  }
              }
          }
        }
       ```

    - Invalid Input - Response (Status 400 Bad Request):
      ```json
        { 
          "success":false,
              "error":{
                  "message":"Title is required"
              }
        }
       ```

2. **Get all Bogs**
     - Retrieve all blog posts 
     - Endpoint: `GET /blog/getAll`

     - Authentication: Optional (Bearer token)

     - Response (Status 200 OK):
       ```json
          {
            "success":true,
            "content":{

              "data": [
                  {
                      "id": 2,
                      "title": "horem",
                      "content": "lo check this",
                      "createdAt": "2024-04-05T07:55:11.000Z",
                      "updatedAt": "2024-04-05T07:55:11.000Z",
                      "User": {
                          "id": 2,
                          "name": "peree",
                          "email": "p@gmail.com",
                          "role": "user",
                          "createdAt": "2024-04-05T07:53:36.000Z",
                          "updatedAt": "2024-04-05T07:53:36.000Z"
                      },
                      "Tags": [
                          {
                              "id": 7,
                              "tagName": "golden",
                              "createdAt": "2024-04-05T07:56:01.000Z",
                              "updatedAt": "2024-04-05T07:56:01.000Z",
                              "BlogTag": {
                                  "id": 21,
                                  "createdAt": "2024-04-05T07:56:07.000Z",
                                  "updatedAt": "2024-04-05T07:56:07.000Z",
                                  "BlogId": 13,
                                  "TagId": 7
                              }
                          },
                        ]
                  },
                  {
                        "id": 1,
                        "title": "New Blog",
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                        "createdAt": "2024-04-06T04:06:06.000Z",
                        "updatedAt": "2024-04-06T04:06:06.000Z",
                        "User": {
                            "id": 1,
                            "name": "user",
                            "email": "user@example.com",
                            "role": "user",
                            "createdAt": "2024-04-06T03:46:26.000Z",
                            "updatedAt": "2024-04-06T03:46:26.000Z"
                        },
                        "Tags": []
                  }
                ]
            }
          }
       ```

3. **Get a Blog**
     - Retrieve a blog post
     - Endpoint : `GET /blog/get/:id`

    - Authentication: Optional (Bearer token)
     - Response (Status 200 OK):
       ```json
        {
          "success": true,
          "content": {
              "data": {
                  "id": 1,
                  "title": "New Blog",
                  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
                  "createdAt": "2024-04-06T04:06:06.000Z",
                  "updatedAt": "2024-04-06T04:06:06.000Z",
                  "User": {
                      "id": 1,
                      "name": "user",
                      "email": "user@example.com",
                      "role": "user",
                      "createdAt": "2024-04-06T03:46:26.000Z",
                      "updatedAt": "2024-04-06T03:46:26.000Z"
                  },
                  "Tags": []
              }
          }
        }
       ```

     - Blog Not found - Response (Status 404 Not Found):
        ```json
          { 
              "success": false,
              "message": "Blog not Found"
          }
4. **Search Blogs by Tags**
      - Search blog posts by Tags 
     - Endpoint: `GET /blog/search?tags=tag1,tag3`
     - Query Parameters:
       - `tags`: tags separated by comma
     
     - Authentication: Optional (Bearer token)
     - Response (Status 200 OK):
        ```json
          {
              "success": true,
              "content": {
                  "data": [
                      {
                          "id": 2,
                          "title": "blog 2",
                          "content": "content of blog2",
                          "createdAt": "2024-04-04T17:37:24.000Z",
                          "updatedAt": "2024-04-04T17:37:24.000Z",
                          "UserId": 1,
                          "Tags": [
                              {
                                  "id": 1,
                                  "tagName": "tag1",
                                  "createdAt": "2024-04-04T17:27:27.000Z",
                                  "updatedAt": "2024-04-04T17:27:27.000Z",
                                  "BlogTag": {
                                      "id": 14,
                                      "createdAt": "2024-04-05T03:51:22.000Z",
                                      "updatedAt": "2024-04-05T03:51:22.000Z",
                                      "BlogId": 2,
                                      "TagId": 1
                                  }
                              },
                              {
                                  "id": 3,
                                  "tagName": "tag3",
                                  "createdAt": "2024-04-05T03:41:44.000Z",
                                  "updatedAt": "2024-04-05T03:41:44.000Z",
                                  "BlogTag": {
                                      "id": 17,
                                      "createdAt": "2024-04-05T03:56:48.000Z",
                                      "updatedAt": "2024-04-05T03:56:48.000Z",
                                      "BlogId": 2,
                                      "TagId": 3
                                  }
                              }
                          ]
                      }
                  ]
              }
          }
        ```



    - Blogs Not found - Response (Status 404 Not Found):
      ```json
        { 
            "success": false,
            "message": "Blog not Found"
        }
        ```



5. **Filter Blogs**
     - Flter blog posts by Tags, date, Author's name
     - Endpoint: `GET /blog/filter?tags=tag1&startDate=2024-04-04&endDate=2024-04-06&author=new user`
     - Parameters:
       - `tags`: tags separated by comma
       - `startDate`: Format: YYYY-MM-DD to YYYY-MM-DD
       - `endDate`: Format: YYYY-MM-DD to YYYY-MM-DD
       - `author`: Author's name
     - Authentication: Optional (Bearer token)
     - Response (Status 200 OK):
       ```json
       {
          "success": true,
          "content": {
              "data": [
                  {
                      "id": 3,
                      "title": "Blog Title",
                      "content": "Blog content",
                      "createdAt": "2024-04-04T17:37:24.000Z",
                      "updatedAt": "2024-04-04T17:37:24.000Z",
                      "UserId": 1,
                      "Tags": [
                          {
                              "id": 1,
                              "tagName": "tag1",
                              "createdAt": "2024-04-04T17:27:27.000Z",
                              "updatedAt": "2024-04-04T17:27:27.000Z",
                              "BlogTag": {
                                  "id": 14,
                                  "createdAt": "2024-04-05T03:51:22.000Z",
                                  "updatedAt": "2024-04-05T03:51:22.000Z",
                                  "BlogId": 3,
                                  "TagId": 1
                              }
                          },
                          {
                              "id": 4,
                              "tagName": "tag4",
                              "createdAt": "2024-04-05T03:41:44.000Z",
                              "updatedAt": "2024-04-05T03:41:44.000Z",
                              "BlogTag": {
                                  "id": 17,
                                  "createdAt": "2024-04-05T03:56:48.000Z",
                                  "updatedAt": "2024-04-05T03:56:48.000Z",
                                  "BlogId": 3,
                                  "TagId": 4
                              }
                          }
                      ]
                  }
              ]
          }
        }
       ```


   - Sent empty input in request - Response (Status 400 Bad Request):
     ```json
       { 
          "success": false,
          "message": "must send alteast date , author or tags"
       }
      ```

   - Blogs Not found - Response (Status 404 Not Found):
     ```json
       { 
          "success": false,
          "message": "Blogs not Found"
       }
      ```
6. **Delete Blog**
     - Search blog posts by Tags 
     - Endpoint: `DELETE /blog/delete:id`
   
     - Authentication: Required (Bearer token)
     - Response (Status 200 OK):
       ```json
       {
          "success": true
       }
       ```

      - Blog does not belong to user - Response (Status 401 Unauthorized):
        ```json
        { 
            "success": false,
            "message": "Unauthorized request"
        }
        ```


### Tag Endpoints

1. **Add Tag:**
     - Add Tag to a particlar Blog
  
     - Endpoint (Add): `POST /tag/add/:blogId`

     - Authentication: Required (Bearer token)

     - Request Body:
       ```json
       {
         "tagName": "tag1"  // tag name can only be alpha numeric
       }
       ```
     - Response (Status 201 Created):
       ```json
        {
          "success": true,
          "content": {
              "data": {
                  "id": 9,
                  "tagName": "myTag",
                  "updatedAt": "2024-04-06T04:58:15.525Z",
                  "createdAt": "2024-04-06T04:58:15.525Z"
              }
          }
        }
       ```

      - Blog does not belong to user - Response (Status 401 Unauthorized):
        ```json
        { 
            "success": false,
            "message": "Unauthorized request"
        }
          ```


     - Tag is already added -  (Status 400 Bad Request):
        ```json
        { 
            "success": false,
              "error": {
                "message": "Tag tagName is already added to this blog"
              }
        }
          ```


2. **Edit Tag**
     - Edit tag of a particular Blog
     - Endpoint (Edit): `PUT /tag/edit/:blogId/:tagId`
     - Authentication: Required (Bearer token)
     - Request Body :
       ```json
       {
         "tagName": "newTag"  // tag name can be only alpha-numberic
       }
       ```
     - Response (Status 200 OK):
       ```json
       {
         "success" : true
       }
       ```
      - Blog on which user is trying to edit tag , does not belong to user - Response (Status 401 Unauthorized):
        ```json
        { 
            "success": false,
            "message": "Unauthorized request"
        }
          ```
     - Tag not found - Response (Status 404 Not Found ):
        ```json
        { 
            "success": false,
            "message": "TagId Not found"
        }
          ```

3. **Delete Tag:**
     - Delete tag of a particular blog
     - Endpoint (Delete): `DELETE /tag/delete/:blogId/:tagId`
     - Authentication: Required (Bearer token)
     - Request Body :
       ```json
       {
         "name": "tag1"  
       }
       ```
     - Response (Status 200 OK):
       ```json
       {
         "success": true
       }
       ```

     - Blog on which user is trying to edit tag , does not belong to user - Response (Status 401 Unauthorized):
        ```json
        { 
            "success": false,
            "message": "Unauthorized request"
        }
          ```
     - Tag not found - Response (Status 404 Not Found ):
        ```json
        { 
            "success": false,
            "message": "TagId Not found"
        }
          ```


