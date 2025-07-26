# Chatbot API with Document Generation

This API provides endpoints for managing data and generating documents in PDF or Word format.

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

The server will start on port 5001.

## API Endpoints

### Base URL: `http://localhost:5001/chatbot/api/v1/info-gathering`

### 1. Add Data

**POST** `/addData`

Add new data to the system.

**Request Body:**

```json
{
  "title": "Project Overview",
  "content": "This is a comprehensive overview of our current project status and objectives.",
  "category": "project"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Data added successfully",
  "data": {
    "id": "1703123456789",
    "title": "Project Overview",
    "content": "This is a comprehensive overview of our current project status and objectives.",
    "category": "project",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Data

**GET** `/getAllData`

Retrieve all data from the system.

**Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": "1",
      "title": "Project Overview",
      "content": "This is a comprehensive overview of our current project status and objectives.",
      "category": "project",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Data by ID

**GET** `/getDataById/:id`

Retrieve specific data by ID.

**Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": "1",
    "title": "Project Overview",
    "content": "This is a comprehensive overview of our current project status and objectives.",
    "category": "project",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### 4. Get Data by Category

**GET** `/getDataByCategory/:category`

Retrieve all data from a specific category.

**Response:**

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": "1",
      "title": "Project Overview",
      "content": "This is a comprehensive overview of our current project status and objectives.",
      "category": "project",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### 5. Generate Document

**POST** `/generateDocument`

Generate a document in PDF or Word format.

**Request Body:**

```json
{
  "format": "pdf",
  "dataIds": ["1", "2"],
  "category": "project",
  "includeMetadata": true
}
```

**Parameters:**

- `format`: "pdf" or "word" (required)
- `dataIds`: Array of data IDs to include (optional)
- `category`: Category to filter by (optional)
- `includeMetadata`: Include generation metadata (optional, default: true)

**Response:**

```json
{
  "success": true,
  "message": "Document generated successfully in PDF format",
  "downloadUrl": "/uploads/document_1703123456789.pdf",
  "fileName": "document_1703123456789.pdf"
}
```

### 6. Download Document

**GET** `/download/:fileName`

Download a generated document.

**Example:** `/download/document_1703123456789.pdf`

## Usage Examples

### Generate PDF with all data:

```bash
curl -X POST http://localhost:5001/chatbot/api/v1/info-gathering/generateDocument \
  -H "Content-Type: application/json" \
  -d '{"format": "pdf"}'
```

### Generate Word document with specific data:

```bash
curl -X POST http://localhost:5001/chatbot/api/v1/info-gathering/generateDocument \
  -H "Content-Type: application/json" \
  -d '{"format": "word", "dataIds": ["1", "2"], "includeMetadata": false}'
```

### Generate PDF for specific category:

```bash
curl -X POST http://localhost:5001/chatbot/api/v1/info-gathering/generateDocument \
  -H "Content-Type: application/json" \
  -d '{"format": "pdf", "category": "project"}'
```

## Features

- ✅ Add and retrieve data
- ✅ Filter data by ID or category
- ✅ Generate PDF documents
- ✅ Generate Word documents (.docx)
- ✅ Include/exclude metadata
- ✅ File download functionality
- ✅ Error handling and validation
- ✅ Mock data for testing

## File Structure

```
src/
├── modules/
│   └── InfoGathering/
│       ├── Controller.ts    # API endpoints
│       ├── service.ts       # Business logic
│       └── model.ts         # Type definitions
├── index.ts                 # Main server file
└── uploads/                 # Generated documents (created automatically)
```

## Dependencies

- `express`: Web framework
- `pdfkit`: PDF generation
- `docx`: Word document generation
- `typescript`: Type safety
- `ts-node-dev`: Development server
