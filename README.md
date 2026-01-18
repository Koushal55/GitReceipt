# GitReceipt

A web application that generates a realistic-looking "Shopping Receipt" based on a user's GitHub activity.
**Live:** [git-receipt-in.vercel.app](https://git-receipt-in.vercel.app)  
**Built with love.**

## Tech Stack
- React (Vite)
- Tailwind CSS
- Lucide React
- html2canvas

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser.

## Features
- **Input:** Enter any GitHub username.
- **Receipt Generation:** Fetches public data and creates a receipt.
- **Funny Taxes:** Adds humorous surcharges based on coding habits.
- **Download:** Save the receipt as a PNG.

## Troubleshooting
If you encounter issues with `npm install`, try:
```bash
npm cache clean --force
npm install --legacy-peer-deps
```
