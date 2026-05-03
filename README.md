# Math Kangaroo Practice Website

A static website for students to practice Math Kangaroo questions for their grade. Hosted at https://varun.khaneja.org/mathroo/

## Features
- Grade selection (1-2, 3-4, 5-6).
- Random selection of 10 questions per practice set.
- **Guarantee that at least 2 visual questions and 2 hard questions are included in every set.**
- Permalinks to share specific practice sets.
- Dark and light modes (Dark mode default).
- **Hard Question Indicator**: Visual cue (🌟 Hard Question) for challenging problems.
- **Gamification**: Timer and badges for accuracy and speed, plus a special "Brainiac" badge for hard questions.
- **PWA Support**: Installable as a Progressive Web App with offline support.
- **Mobile Friendly**: Responsive design for smaller screens.
- **Analytics**: Integrated with Cloudflare Web Analytics.

## Data
- `questions.json`: Contains the pool of questions.
- `samples/`: Contains sample question and solution PDFs downloaded from Math Kangaroo websites.
    - Files named `*_Ecolier.pdf` are for Grade 3-4.
    - Files named `*_Benjamin.pdf` are for Grade 5-6.
    - Other files cover various grades and years.

## How to Run
Open `index.html` in a web browser.