/* ============================================
   GOOGLE SHEETS INTEGRATION
   Public API Key Approach
   ============================================ */

// Configuration - UPDATE THESE VALUES
const SHEETS_CONFIG = {
  apiKey: 'YOUR_GOOGLE_API_KEY_HERE',
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
  sheets: {
    content: 'Content',
    noticeboard: 'Noticeboard',
    tenders: 'Tenders',
    results: 'Results'
  }
};

// Base URL for Google Sheets API
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetch data from a specific sheet tab
 */
async function fetchSheetData(sheetName, range = '') {
  const fullRange = range ? `${sheetName}!${range}` : sheetName;
  const url = `${SHEETS_API_BASE}/${SHEETS_CONFIG.spreadsheetId}/values/${fullRange}?key=${SHEETS_CONFIG.apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
}

/**
 * Convert sheet rows to objects using first row as headers
 */
function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * Load content from Content sheet
 * Expected columns: Page Name, Section Name, Text Content, Image URL
 */
async function loadContent(pageName = null) {
  const rows = await fetchSheetData(SHEETS_CONFIG.sheets.content);
  const content = rowsToObjects(rows);
  
  if (pageName) {
    return content.filter(item => item['Page Name'] === pageName);
  }
  return content;
}

/**
 * Load noticeboard announcements
 * Expected columns: Date, Announcement Title, Short Description
 */
async function loadNoticeboard(limit = 5) {
  const rows = await fetchSheetData(SHEETS_CONFIG.sheets.noticeboard);
  const announcements = rowsToObjects(rows);
  
  // Sort by date (newest first) and limit
  return announcements
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, limit);
}

/**
 * Load tenders
 * Expected columns: Year, Tender Name, Tender Number, Deadline, PDF_Link
 */
async function loadTenders(year = null) {
  const rows = await fetchSheetData(SHEETS_CONFIG.sheets.tenders);
  const tenders = rowsToObjects(rows);
  
  if (year) {
    return tenders.filter(tender => tender.Year === year.toString());
  }
  return tenders;
}

/**
 * Load examination results
 * Expected columns: Year, Term, Curriculum, File_Name, PDF_Link
 */
async function loadResults(filters = {}) {
  const rows = await fetchSheetData(SHEETS_CONFIG.sheets.results);
  let results = rowsToObjects(rows);
  
  // Apply filters
  if (filters.year) {
    results = results.filter(r => r.Year === filters.year.toString());
  }
  if (filters.term) {
    results = results.filter(r => r.Term === filters.term);
  }
  if (filters.curriculum) {
    results = results.filter(r => r.Curriculum === filters.curriculum);
  }
  
  return results;
}

/**
 * Display noticeboard on homepage
 */
async function displayNoticeboard() {
  const container = document.getElementById('noticeboard-container');
  if (!container) return;
  
  container.innerHTML = '<div class="loading"></div>';
  
  const announcements = await loadNoticeboard(3);
  
  if (announcements.length === 0) {
    container.innerHTML = '<p>No announcements at this time.</p>';
    return;
  }
  
  container.innerHTML = announcements.map(announcement => `
    <div class="card animate-in" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <h4 style="margin: 0;">${announcement['Announcement Title']}</h4>
        <span style="color: var(--primary-green); font-size: 0.875rem;">${announcement.Date}</span>
      </div>
      <p style="margin: 0;">${announcement['Short Description']}</p>
    </div>
  `).join('');
  
  // Trigger animations
  setTimeout(() => {
    container.querySelectorAll('.card').forEach((card, index) => {
      setTimeout(() => card.classList.add('animate-in'), index * 100);
    });
  }, 100);
}

/**
 * Display tenders table
 */
async function displayTenders() {
  const tableBody = document.getElementById('tenders-table-body');
  const cardsContainer = document.getElementById('tenders-cards');
  
  if (!tableBody && !cardsContainer) return;
  
  if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="loading"></div></td></tr>';
  if (cardsContainer) cardsContainer.innerHTML = '<div class="loading"></div>';
  
  const tenders = await loadTenders();
  
  if (tenders.length === 0) {
    if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No tenders available</td></tr>';
    if (cardsContainer) cardsContainer.innerHTML = '<p>No tenders available</p>';
    return;
  }
  
  // Desktop table view
  if (tableBody) {
    tableBody.innerHTML = tenders.map(tender => `
      <tr>
        <td>${tender.Year}</td>
        <td>${tender['Tender Name']}</td>
        <td>${tender['Tender Number']}</td>
        <td>${tender.Deadline}</td>
        <td><a href="${tender.PDF_Link}" target="_blank" class="btn btn-primary" style="padding: 0.5rem 1rem;">Download</a></td>
      </tr>
    `).join('');
  }
  
  // Mobile cards view
  if (cardsContainer) {
    cardsContainer.innerHTML = tenders.map(tender => `
      <div class="tender-card">
        <div class="tender-card-row">
          <span class="tender-card-label">Year:</span>
          <span>${tender.Year}</span>
        </div>
        <div class="tender-card-row">
          <span class="tender-card-label">Tender Name:</span>
          <span>${tender['Tender Name']}</span>
        </div>
        <div class="tender-card-row">
          <span class="tender-card-label">Tender Number:</span>
          <span>${tender['Tender Number']}</span>
        </div>
        <div class="tender-card-row">
          <span class="tender-card-label">Deadline:</span>
          <span>${tender.Deadline}</span>
        </div>
        <div class="tender-card-row">
          <span class="tender-card-label">Download:</span>
          <a href="${tender.PDF_Link}" target="_blank" class="btn btn-primary" style="padding: 0.5rem 1rem;">Download PDF</a>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Display examination results with filters
 */
async function displayResults() {
  const resultsContainer = document.getElementById('results-container');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '<div class="loading"></div>';
  
  // Get filter values
  const yearFilter = document.getElementById('year-filter')?.value || '';
  const termFilter = document.getElementById('term-filter')?.value || '';
  const curriculumFilter = document.getElementById('curriculum-filter')?.value || '';
  
  const filters = {};
  if (yearFilter) filters.year = yearFilter;
  if (termFilter) filters.term = termFilter;
  if (curriculumFilter) filters.curriculum = curriculumFilter;
  
  const results = await loadResults(filters);
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center">No results found for the selected filters.</p>';
    return;
  }
  
  resultsContainer.innerHTML = `
    <div class="grid grid-3">
      ${results.map(result => `
        <div class="card">
          <h4>${result.File_Name}</h4>
          <p><strong>Year:</strong> ${result.Year}</p>
          <p><strong>Term:</strong> ${result.Term}</p>
          <p><strong>Curriculum:</strong> ${result.Curriculum}</p>
          <a href="${result.PDF_Link}" target="_blank" class="btn btn-primary mt-1">Download Results</a>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Setup filter listeners for results page
 */
function setupResultsFilters() {
  const yearFilter = document.getElementById('year-filter');
  const termFilter = document.getElementById('term-filter');
  const curriculumFilter = document.getElementById('curriculum-filter');
  
  if (yearFilter) yearFilter.addEventListener('change', displayResults);
  if (termFilter) termFilter.addEventListener('change', displayResults);
  if (curriculumFilter) curriculumFilter.addEventListener('change', displayResults);
}

// Export functions for use in HTML pages
window.SheetsAPI = {
  loadContent,
  loadNoticeboard,
  loadTenders,
  loadResults,
  displayNoticeboard,
  displayTenders,
  displayResults,
  setupResultsFilters
};
