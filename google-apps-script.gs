/**
 * Google Apps Script Web App for collecting reviews
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Add headers to the first row: Timestamp | Name | Email | Rating | Message
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code, replacing everything.
 * 5. Click Deploy > New Deployment.
 * 6. Select type "Web app".
 * 7. Execute as: Me. Who has access: Anyone.
 * 8. Copy the Web App URL and paste it in your .env.local as GOOGLE_SCRIPT_URL.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    const row = [
      new Date(),
      data.name || "",
      data.email || "",
      data.rating || "",
      data.message || ""
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("This is a webhook for POST requests only.");
}
