# Gichuru Memorial Secondary School Website

A professional, mobile-first website built with vanilla HTML/CSS/JavaScript and Google Sheets as a headless CMS.

## 🎨 Features

- **Mobile-First Design** - Fully responsive across all devices
- **School Colors** - Primary Green (#1A3923), Electric Yellow (#F2F52C), Cloud Blue (#CBDEE5)
- **Hero Carousel** - Auto-playing with lazy-loaded images
- **Google Sheets Integration** - Dynamic content from Google Sheets
- **Animated Cards** - Scroll-triggered fade-in animations
- **WhatsApp Integration** - Floating button with glow animation
- **Responsive Tenders Table** - Desktop table view, mobile card view
- **Examination Portal** - Filterable results by year, term, and curriculum
- **Contact Form** - Integrated with Google Apps Script

## 📁 Project Structure

```
Gichuru Memorial School/
├── index.html              # Homepage
├── about.html              # About Us page
├── academics.html          # Academics & CBC Pathways
├── departments.html        # Departments & Facilities
├── finance.html            # Tenders, Fees, Donations
├── contact.html            # Contact form & map
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── sheets-integration.js   # Google Sheets API
│   ├── carousel.js             # Hero carousel
│   ├── animations.js           # Scroll animations
│   ├── mobile-menu.js          # Mobile navigation
│   └── form-handler.js         # Contact form
└── images/
    ├── carousel/           # Hero images
    ├── gallery/            # Photo gallery
    ├── departments/        # Department images
    └── whatsapp.png        # WhatsApp icon
```

## 🚀 Quick Start

### 1. Setup Google Sheets

1. Create a new Google Sheet
2. Create the following tabs:
   - **Content** (columns: Page Name, Section Name, Text Content, Image URL)
   - **Noticeboard** (columns: Date, Announcement Title, Short Description)
   - **Tenders** (columns: Year, Tender Name, Tender Number, Deadline, PDF_Link)
   - **Results** (columns: Year, Term, Curriculum, File_Name, PDF_Link)
   - **Enquiries** (columns: Timestamp, Name, Email, Phone, Subject, Message)

3. Make the sheet publicly viewable (Share > Anyone with the link can view)

### 2. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials > API Key
5. Restrict the key to Google Sheets API only

### 3. Configure the Website

Edit `js/sheets-integration.js`:

```javascript
const SHEETS_CONFIG = {
  apiKey: 'YOUR_GOOGLE_API_KEY_HERE',
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
  // ... rest of config
};
```

Edit `js/form-handler.js`:

```javascript
const FORM_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

### 4. Deploy Google Apps Script

See `SHEETS_SETUP.md` for detailed instructions on setting up the Google Apps Script for form submissions.

### 5. Add Images

Replace placeholder images in the `images/` directory:
- **Carousel images** (hero1.png, hero2.png, hero3.png) - 1920x600px recommended
- **Gallery images** (gallery1-4.png) - 800x600px recommended
- **WhatsApp icon** (whatsapp.png) - Download from [WhatsApp Brand](https://www.whatsapp.com/brand/)

### 6. Test Locally

```bash
# Using Python
python -m http.server 8001

# Using Node.js
npx -y http-server -p 8001 -o

# Using PHP
php -S localhost:8001
```

Visit `http://localhost:8001` in your browser.

## 📝 Content Management

### Adding Noticeboard Announcements

1. Open your Google Sheet
2. Go to the **Noticeboard** tab
3. Add a new row with: Date, Title, Description
4. The homepage will automatically display the latest 3 announcements

### Adding Tenders

1. Go to the **Tenders** tab
2. Add: Year, Tender Name, Tender Number, Deadline, PDF_Link
3. Upload PDF to Google Drive and get shareable link
4. The Finance page will display all tenders

### Adding Examination Results

1. Go to the **Results** tab
2. Add: Year, Term, Curriculum, File_Name, PDF_Link
3. Upload PDF to Google Drive and get shareable link
4. Students can filter and download results

## 🎨 Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
  --primary-green: #1A3923;
  --electric-yellow: #F2F52C;
  --cloud-blue: #CBDEE5;
  --pure-black: #000000;
}
```

### School Information

Update contact details in all HTML files (footer sections):
- Address
- Phone number
- Email
- Social media links

## 📱 Mobile Optimization

The website is fully optimized for mobile devices:
- Hamburger menu for navigation
- Responsive tender table (switches to cards on mobile)
- Touch-enabled carousel
- Optimized images with lazy loading
- Mobile-friendly forms

## 🌐 Deployment

### GitHub Pages

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings > Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repository-name/`

### Custom Domain

1. Add a `CNAME` file with your domain name
2. Configure DNS records with your domain provider
3. Add A records pointing to GitHub Pages IPs

## 📞 Support

For issues or questions:
- **Email**: gichurumemo@gmail.com
- **Phone**: 0790-268040

## 📄 License

© 2026 Gichuru Memorial Secondary School. All rights reserved.
