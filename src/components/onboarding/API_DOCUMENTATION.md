# API Documentation for OnboardingTasksAdmin Component

## Base URL

`http://localhost:3001/api`

## Authentication

```javascript
headers: {
  Authorization: `Bearer ${token}`;
}
```

## API Endpoints

### 1. Fetch Onboarding Tasks

**Endpoint:** `/tasks/onboarding`  
**Method:** GET

**Response:**

```json
[
  {
    "id": "string",
    "task_name": "string",
    "description": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 2. Fetch All Volunteers with Roles

**Endpoint:** `/volunteers/all`  
**Method:** GET  
**Authentication:** Required

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "Volunteer": {
        "jobTitles": [
          {
            "id": "string",
            "title": "string"
          }
        ]
      }
    }
  ]
}
```

### 3. Fetch Paginated Volunteers for Admin

**Endpoint:** `/volunteer-tasks/admin/volunteers`  
**Method:** GET  
**Authentication:** Required  
**Query Parameters:** `?page=${currentPage}&pageSize=${pageSize}&taskId=${filter.taskId}&taskStatus=${filter.status}`

**Response:**

```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "profile_pic": "string",
      "currentTask": {
        "id": "string",
        "task_name": "string",
        "status": "string",
        "dueDate": "string",
        "createdAt": "string",
        "progress": "string",
        "description": "string"
      }
    }
  ],
  "totalCount": 10
}
```

### 4. Update Volunteer Task Status

**Endpoint:** `/volunteer-tasks/:id`  
**Method:** PUT  
**Authentication:** Required  
**URL Parameters:** `id=string`

**Request:**

```json
{
  "status": "complete"
}
```

**Response:**

```json
{
  "id": "string",
  "status": "complete",
  "updatedAt": "string"
}
```

### 5. Update Volunteer Status

**Endpoint:** `/volunteers/:id`  
**Method:** PUT  
**Authentication:** Required  
**URL Parameters:** `id=string`

**Request:**

```json
{
  "status": "complete"
}
```

**Response:**

```json
{
  "id": "string",
  "status": "complete",
  "updatedAt": "string"
}
```

## API Response Structures

### Onboarding Tasks Response

```javascript
[
  {
    task_name: string,
    // other task properties
  },
];
```

### Volunteers with Roles Response

```javascript
{
  data: [
    {
      id: string,
      Volunteer: {
        jobTitles: [
          {
            title: string,
          },
        ],
      },
    },
  ];
}
```

### Paginated Volunteers Response

```javascript
{
  data: [
    {
      id: string,
      firstName: string,
      lastName: string,
      email: string,
      profile_pic: string,
      currentTask: {
        task_name: string,
        status: string,
        dueDate: string,
        createdAt: string,
        progress: string,
        description: string,
      },
    },
  ];
}
```

## Error Handling

The component logs API errors to the console but doesn't implement comprehensive error handling. Consider adding:

- User-friendly error messages
- Retry mechanisms for failed requests
- Loading states during API calls
- Proper error boundaries

## Notes

- The component uses a mix of pagination approaches (both client-side and server-side)
- Some API calls are made redundantly (e.g., `fetchAllVolunteersForRole` is called in multiple places)
- Consider implementing caching for frequently accessed data
- The component assumes certain response structures; ensure the backend API matches these expectations
