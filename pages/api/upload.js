// File upload API endpoint for blueprints with rate limiting
import { promises as fs } from 'fs';
import path from 'path';
import { uploadRateLimit } from '../../lib/rateLimit.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Apply rate limiting
  await uploadRateLimit(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  try {
    // Parse multipart form data
    const chunks = [];
    const boundary = req.headers['content-type'].split('boundary=')[1];
    
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    const formData = parseMultipartData(buffer, boundary);
    
    // Get the uploaded file
    const file = formData.get('file');
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    await fs.writeFile(filepath, file.data);

    // Return file info
    res.status(200).json({
      message: 'File uploaded successfully',
      filename,
      size: file.data.length,
      type: file.type,
      url: `/uploads/${filename}`
    });

  } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}

function parseMultipartData(buffer, boundary) {
  const data = new Map();
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
  
  let start = 0;
  while (start < buffer.length) {
    const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIndex === -1) break;
    
    const endBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
    if (endBoundaryIndex === -1) break;
    
    const contentStart = boundaryIndex + boundaryBuffer.length + 2; // +2 for \r\n
    const contentEnd = endBoundaryIndex - 2; // -2 for \r\n before boundary
    
    const content = buffer.slice(contentStart, contentEnd);
    const headerEnd = content.indexOf(Buffer.from('\r\n\r\n'));
    
    if (headerEnd !== -1) {
      const headers = content.slice(0, headerEnd).toString();
      const fileData = content.slice(headerEnd + 4);
      
      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
      
      if (nameMatch) {
        const name = nameMatch[1];
        if (filenameMatch && contentTypeMatch) {
          data.set(name, {
            name: filenameMatch[1],
            type: contentTypeMatch[1],
            data: fileData
          });
        }
      }
    }
    
    start = endBoundaryIndex;
  }
  
  return data;
}
