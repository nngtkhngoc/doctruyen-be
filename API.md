# DocTruyen API Documentation

This document provides a comprehensive overview of the API endpoints available in the doctruyen-be project.

## Base URL

```
http://localhost:5001/api
```

## Authentication

### Sign Up

**POST** `/auth/sign-up`

Register a new user.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "phone_number": "string",
  "password": "string",
  "confirm_password": "string",
  "role": "string", (optional)
  "profile_pic": "string" (optional)
}
```

**Response:**

- `200 OK`: Registration successful
- `400 Bad Request`: Validation error
- `409 Conflict`: Email/username/phone already exists
- `500 Internal Server Error`: Server error

### Sign In

**POST** `/auth/sign-in`

Log in a user.

**Request Body:**

```json
{
  "identifier": "string", // username, email, or phone_number
  "password": "string"
}
```

**Response:**

- `200 OK`: Login successful
- `400 Bad Request`: Missing credentials
- `404 Not Found`: User not found
- `406 Not Acceptable`: Incorrect password
- `500 Internal Server Error`: Server error

### Sign Out

**POST** `/auth/sign-out`

Log out the current user.

**Response:**

- `200 OK`: Logout successful
- `500 Internal Server Error`: Server error

### Get Current User

**GET** `/auth/me`

Get information about the currently logged-in user.

**Headers:**

- `Cookie`: jwt token cookie

**Response:**

- `200 OK`: User information
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

### Get User by ID

**GET** `/auth/:id`

Get information about a specific user.

**Parameters:**

- `id`: User ID

**Response:**

- `200 OK`: User information
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

### Update User

**PUT** `/auth`

Update user information.

**Headers:**

- `Cookie`: jwt token cookie

**Request Body:**

```json
{
  "username": "string", (optional)
  "email": "string", (optional)
  "phone_number": "string", (optional)
  "fullname": "string", (optional)
  "profile_pic": "string" (optional)
}
```

**Response:**

- `200 OK`: Update successful
- `400 Bad Request`: Validation error
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

### Email Verification

#### Get Verification Token

**GET** `/auth/verification-token`

Request an email verification token.

**Headers:**

- `Cookie`: jwt token cookie

**Response:**

- `200 OK`: Token sent successfully
- `400 Bad Request`: User already verified
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### Verify Email

**POST** `/auth/verify-email`

Verify user email with token.

**Headers:**

- `Cookie`: jwt token cookie

**Request Body:**

```json
{
  "verification_token": "string"
}
```

**Response:**

- `200 OK`: Email verified successfully
- `404 Not Found`: Invalid token
- `500 Internal Server Error`: Server error

### Password Reset

#### Get Reset Password Token

**POST** `/auth/reset-password-token`

Request a password reset token.

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:**

- `200 OK`: Reset token sent successfully
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### Reset Password

**POST** `/auth/reset-password/:reset_password_token`

Reset password using token.

**Parameters:**

- `reset_password_token`: Password reset token

**Request Body:**

```json
{
  "new_password": "string",
  "confirm_new_password": "string"
}
```

**Response:**

- `200 OK`: Password reset successful
- `400 Bad Request`: Validation error or invalid token
- `500 Internal Server Error`: Server error

### Ban User

**PUT** `/auth/ban`

Ban a user (Admin only).

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "user_id": "string"
}
```

**Response:**

- `200 OK`: User banned successfully
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## Stories

### Get All Stories

**GET** `/stories`

Get a list of stories with optional filtering.

**Query Parameters:**

- `limit`: Number of stories per page
- `page`: Page number
- `sort`: Field to sort by (`title`, `like_counts`, `rating_avg`, `published_at`, `price`)
- `order`: Sort order (`asc`, `desc`)
- `genres`: Filter by genre names (comma-separated)
- `authors`: Filter by author names (comma-separated)
- `title`: Filter by story title

**Response:**

- `200 OK`: List of stories
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

### Get Story by ID

**GET** `/stories/:story_id`

Get details of a specific story.

**Parameters:**

- `story_id`: Story ID

**Response:**

- `200 OK`: Story details
- `404 Not Found`: Story not found
- `500 Internal Server Error`: Server error

### Create Story

**POST** `/stories`

Create a new story (Admin only).

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "title": "string",
  "author_name": "string",
  "description": "string",
  "cover_image": "string", (optional)
  "price": number, (optional)
  "status": "string", (optional)
  "progress": "string", (optional)
  "genres": ["string"]
}
```

**Response:**

- `201 Created`: Story created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authorized as admin
- `500 Internal Server Error`: Server error

### Update Story

**PUT** `/stories/:story_id`

Update an existing story (Admin only).

**Parameters:**

- `story_id`: Story ID

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "title": "string", (optional)
  "author_name": "string", (optional)
  "description": "string", (optional)
  "cover_image": "string", (optional)
  "price": number, (optional)
  "status": "string", (optional)
  "progress": "string", (optional)
  "genres": ["string"] (optional)
}
```

**Response:**

- `200 OK`: Story updated successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Story not found
- `500 Internal Server Error`: Server error

### Delete Story

**DELETE** `/stories/:story_id`

Delete a story (Admin only).

**Parameters:**

- `story_id`: Story ID

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Response:**

- `200 OK`: Story deleted successfully
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Story not found
- `500 Internal Server Error`: Server error

### Like Story

**POST** `/stories/:story_id/like`

Like or unlike a story.

**Parameters:**

- `story_id`: Story ID

**Headers:**

- `Cookie`: jwt token cookie

**Response:**

- `200 OK`: Like operation successful
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Comment on Story

**POST** `/stories/:story_id/comment`

Add a comment to a story.

**Parameters:**

- `story_id`: Story ID

**Headers:**

- `Cookie`: jwt token cookie

**Request Body:**

```json
{
  "content": "string"
}
```

**Response:**

- `200 OK`: Comment added successfully
- `401 Unauthorized`: Not authenticated or user is banned
- `500 Internal Server Error`: Server error

### Delete Story Comment

**DELETE** `/stories/:story_id/comment/:comment_id`

Delete a story comment.

**Parameters:**

- `story_id`: Story ID
- `comment_id`: Comment ID

**Headers:**

- `Cookie`: jwt token cookie

**Response:**

- `200 OK`: Comment deleted successfully
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Server error

### Rate Story

**POST** `/stories/:story_id/rate`

Rate a story.

**Parameters:**

- `story_id`: Story ID

**Headers:**

- `Cookie`: jwt token cookie

**Request Body:**

```json
{
  "score": number (1-5)
}
```

**Response:**

- `200 OK`: Rating successful
- `400 Bad Request`: Invalid rating score
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

## Chapters

### Get Chapter by ID

**GET** `/chapters/:chapter_id`

Get details of a specific chapter.

**Parameters:**

- `chapter_id`: Chapter ID

**Response:**

- `200 OK`: Chapter details
- `404 Not Found`: Chapter not found
- `500 Internal Server Error`: Server error

### Get Chapter By Story Id and Chapter Number

**GET** `/chapters/:story_id/:chapter_number`

Get details of a specific chapter of a story.

**Parameters:**

- `story_id`: Story ID
- `chapter_number` : Chapter number
  **Response:**

- `200 OK`: Chapter details
- `404 Not Found`: Chapter not found
- `500 Internal Server Error`: Server error

### Create Chapter

**POST** `/chapters`

Create a new chapter (Admin only).

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "title": "string",
  "chapter_number": number,
  "content": "string",
  "status": "string", (optional)
  "story_id": "string"
}
```

**Response:**

- `200 OK`: Chapter created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authorized as admin
- `500 Internal Server Error`: Server error

### Update Chapter

**PUT** `/chapters/:chapter_id`

Update an existing chapter (Admin only).

**Parameters:**

- `chapter_id`: Chapter ID

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "title": "string", (optional)
  "content": "string", (optional)
  "status": "string" (optional)
}
```

**Response:**

- `200 OK`: Chapter updated successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Chapter not found
- `500 Internal Server Error`: Server error

### Delete Chapter

**DELETE** `/chapters/:chapter_id`

Delete a chapter (Admin only).

**Parameters:**

- `chapter_id`: Chapter ID

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Response:**

- `200 OK`: Chapter deleted successfully
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Chapter not found
- `500 Internal Server Error`: Server error

## Genres

### Get All Genres

**GET** `/genres`

Get a list of all genres.

**Response:**

- `200 OK`: List of genres
- `500 Internal Server Error`: Server error

### Get Genre by ID

**GET** `/genres/:genre_id`

Get details of a specific genre.

**Parameters:**

- `genre_id`: Genre ID

**Response:**

- `200 OK`: Genre details
- `404 Not Found`: Genre not found
- `500 Internal Server Error`: Server error

### Create Genre

**POST** `/genres`

Create a new genre (Admin only).

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Request Body:**

```json
{
  "name": "string"
}
```

**Response:**

- `200 OK`: Genre created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authorized as admin
- `409 Conflict`: Genre already exists
- `500 Internal Server Error`: Server error

### Delete Genre

**DELETE** `/genres/:genre_id`

Delete a genre (Admin only).

**Parameters:**

- `genre_id`: Genre ID

**Headers:**

- `Cookie`: jwt token cookie (must be admin)

**Response:**

- `200 OK`: Genre deleted successfully
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Genre not found
- `500 Internal Server Error`: Server error

## Blogs

### Get All Blogs

**GET** `/blogs`

Get a list of blogs with optional filtering.

**Query Parameters:**

- `limit`: Number of blogs per page
- `page`: Page number
- `filter_value`: Filter by title or author

**Response:**

- `200 OK`: List of blogs
- `500 Internal Server Error`: Server error

### Get Blog by ID

**GET** `/blogs/:blog_id`

Get details of a specific blog.

**Parameters:**

- `blog_id`: Blog ID

**Response:**

- `200 OK`: Blog details
- `404 Not Found`: Blog not found
- `500 Internal Server Error`: Server error

### Create Blog

**POST** `/blogs`

Create a new blog.

**Headers:**

- `Cookie`: jwt token cookie

**Request Body:**

```json
{
  "title": "string",
  "content": "string",
  "cover_image": "string"
}
```

**Response:**

- `200 OK`: Blog created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authenticated or user is banned
- `500 Internal Server Error`: Server error

### Delete Blog

**DELETE** `/blogs/:blog_id`

Delete a blog.

**Parameters:**

- `blog_id`: Blog ID

**Headers:**

- `Cookie`: jwt token cookie

**Response:**

- `200 OK`: Blog deleted successfully
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

## Chatbot

### Handle User Input

**POST** `/chatbot`

Send a message to the chatbot and receive a response.

**Request Body:**

```json
{
  "message": "string"
}
```

**Response:**

- `200 OK`: Chatbot response
- `400 Bad Request`: Message is required
- `500 Internal Server Error`: Server error

## Error Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request or validation error
- `401 Unauthorized`: Authentication required or insufficient permissions
- `404 Not Found`: Resource not found
- `406 Not Acceptable`: Incorrect credentials
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error
