# Setup Guide: Hooks & Knots Crochet E-Commerce

Follow these steps to fully deploy and configure your role-based e-commerce application.

## A. Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a new Web App to get your Firebase config (`apiKey`, `authDomain`, etc.).
3. Copy these values into `.env.local` (using `.env.local.example` as a template).

## B. Enabling Auth, Firestore, and Storage
1. **Authentication**: In the Firebase console, go to Authentication > Sign-in method and enable **Email/Password**.
2. **Firestore Database**: Create a database. Start in production mode.
   - Go to the Rules tab and paste the contents of `firestore.rules`.
   - Go to the Indexes tab and deploy the indexes via CLI (`firebase deploy --only firestore:indexes`) or build them manually as they fail in the console.
3. **Storage**: Set up Firebase Storage and update the Rules tab with the contents of `storage.rules`.

## C. Deploying Google Apps Script
1. Go to [Google Sheets](https://sheets.google.com/) and create a new sheet named "Crochet Reviews".
2. Set row 1 headers: `Timestamp | Name | Email | Rating | Message`.
3. Click Extensions > Apps Script.
4. Replace the code with the contents of `google-apps-script.gs`.
5. Click **Deploy > New Deployment**.
   - Type: Web App
   - Execute as: Me
   - Who has access: Anyone
6. Copy the **Web App URL** and add it to your `.env.local` as `GOOGLE_SCRIPT_URL`.

## D. Getting WhatsApp Cloud API Credentials
1. Go to the [Meta for Developers](https://developers.facebook.com/) portal.
2. Create an App (Type: Business).
3. Add the **WhatsApp** product.
4. From the API Setup page, get your:
   - Temporary Access Token (or generate a permanent System User token).
   - Phone Number ID.
5. Add these to `.env.local` as `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.
6. Add your manager phone number (with country code, no +, e.g., `919876543210`) as `MANAGER_WHATSAPP_NUMBER`.

## E. Setting Up the First Manager Account
1. Go to your deployed website and sign up normally as a new user.
2. Go to the Firebase Console > Firestore Database.
3. Navigate to the `users` collection.
4. Find the document with your email and change the `role` field from `"user"` to `"manager"`.
5. Refresh the website. You will now see the Manager Badge and inline editing tools!

## F. Vercel Deployment
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your project.
3. In the Environment Variables section, add all variables from your `.env.local`.
4. Click Deploy.

## G. How Real-Time Updates Work
- **Settings**: The `useSettings` hook listens to `/siteSettings/config` using Firestore's `onSnapshot()`. Whenever the manager edits text and clicks "Save All" in the `ManagerSaveBar`, it batch-updates Firestore, and the UI updates instantly for all users.
- **Products**: The `useProducts` query in the Shop uses `onSnapshot()`. Adding or editing a product from the manager modal updates the grid in real-time.

## H. Seeding Initial Data
- As a manager, go to the Shop page and click **Add New Product**.
- Upload an image, set a title, price, and category. Click Save.
- To set the homepage text, simply click on the text in the Navbar or Hero Section, type your new copy, and click **Save All** in the sticky bottom bar.
