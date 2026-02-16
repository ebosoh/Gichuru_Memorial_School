# Google Sheets Setup Guide

Complete guide for setting up Google Sheets as a headless CMS for the Gichuru Memorial website.

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Gichuru Memorial School CMS"

## Step 2: Create Required Tabs

Create the following tabs with exact column headers:

### Tab 1: Content
| Page Name | Section Name | Text Content | Image URL |
|-----------|--------------|--------------|-----------|
| Home | Hero | Welcome message | https://... |
| About | History | School history text | https://... |

**Purpose**: Store page content that can be updated without editing HTML

### Tab 2: Noticeboard
| Date | Announcement Title | Short Description |
|------|-------------------|-------------------|
| 2026-02-16 | School Opening | Term 1 begins on... |
| 2026-02-10 | Sports Day | Annual sports day... |

**Purpose**: Latest announcements displayed on homepage

### Tab 3: Tenders
| Year | Tender Name | Tender Number | Deadline | PDF_Link |
|------|-------------|---------------|----------|----------|
| 2026 | Supply of Stationery | GMSS/T/001/2026 | 2026-03-15 | https://drive.google.com/... |

**Purpose**: Current and past tenders for download

### Tab 4: Results
| Year | Term | Curriculum | File_Name | PDF_Link |
|------|------|------------|-----------|----------|
| 2025 | Term 3 | CBC | Grade 10 Results | https://drive.google.com/... |
| 2025 | Term 3 | 8-4-4 | Form 4 Results | https://drive.google.com/... |

**Purpose**: Examination results with filtering

### Tab 5: Enquiries
| Timestamp | Name | Email | Phone | Subject | Message |
|-----------|------|-------|-------|---------|---------|
| (Auto-filled by form submissions) |

**Purpose**: Store contact form submissions

## Step 3: Make Sheet Public

1. Click **Share** button (top right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer**
4. Click **Done**
5. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

## Step 4: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click **Select a project** > **New Project**
   - Name: "Gichuru Memorial Website"
   - Click **Create**

3. Enable Google Sheets API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google Sheets API"
   - Click **Enable**

4. Create API Key:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API Key**
   - Copy the API key

5. Restrict the API Key (Recommended):
   - Click on the API key you just created
   - Under **API restrictions**, select **Restrict key**
   - Check **Google Sheets API**
   - Under **Website restrictions**, add your domain
   - Click **Save**

## Step 5: Configure Website

Edit `js/sheets-integration.js`:

```javascript
const SHEETS_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE',  // Paste your API key
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',  // Paste spreadsheet ID
  sheets: {
    content: 'Content',
    noticeboard: 'Noticeboard',
    tenders: 'Tenders',
    results: 'Results'
  }
};
```

## Step 6: Setup Google Apps Script for Form Submissions

### Create Apps Script Project

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code
3. Copy and paste the following code:

```javascript
/**
 * Handle form submissions from contact page
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the Enquiries sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Enquiries');
    
    // Add timestamp
    const timestamp = new Date();
    
    // Append data to sheet
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || ''
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Form handler is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### Deploy the Script

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to **Select type**
3. Select **Web app**
4. Configure:
   - **Description**: "Contact Form Handler"
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the script (you may see a warning - click Advanced > Go to project)
7. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### Update Website Configuration

Edit `js/form-handler.js`:

```javascript
const FORM_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
```

## Step 7: Test the Integration

### Test Noticeboard

1. Add a test announcement to the Noticeboard tab
2. Open `index.html` in a browser
3. Check if the announcement appears

### Test Tenders

1. Add a test tender to the Tenders tab
2. Open `finance.html`
3. Verify the tender appears in both table and card views

### Test Contact Form

1. Open `contact.html`
2. Fill out and submit the form
3. Check the Enquiries tab for the submission

## Troubleshooting

### "Failed to fetch" Error

- Check that the spreadsheet is set to "Anyone with the link can view"
- Verify the spreadsheet ID is correct
- Ensure Google Sheets API is enabled in Cloud Console

### Form Submissions Not Appearing

- Check that the Apps Script is deployed as a web app
- Verify "Who has access" is set to "Anyone"
- Check the Enquiries tab has the correct column headers

### API Key Not Working

- Ensure the API key is not restricted to specific domains during testing
- Check that Google Sheets API is enabled
- Verify the API key is copied correctly (no extra spaces)

## Sample Data

### Sample Noticeboard Entry
```
Date: 2026-02-16
Announcement Title: School Reopening
Short Description: We are pleased to announce that Term 1 will begin on Monday, February 20, 2026. All students should report by 8:00 AM.
```

### Sample Tender Entry
```
Year: 2026
Tender Name: Supply of Laboratory Equipment
Tender Number: GMSS/T/002/2026
Deadline: March 30, 2026
PDF_Link: https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
```

### Sample Results Entry
```
Year: 2025
Term: Term 3
Curriculum: CBC
File_Name: Grade 10 End of Year Results
PDF_Link: https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
```

## Uploading PDFs to Google Drive

1. Upload PDF to Google Drive
2. Right-click > **Get link**
3. Set to **Anyone with the link can view**
4. Copy the link
5. Paste in the PDF_Link column

## Security Notes

- The API key allows read-only access to public sheets
- Form submissions are handled server-side via Apps Script
- Never expose private/sensitive data in public sheets
- Consider using a service account for production (more secure)

## Support

For technical issues:
- Check the browser console for error messages
- Verify all URLs and IDs are correct
- Test with sample data first

For questions, contact: gichurumemo@gmail.com
