# Math Kangaroo Practice Website

A static website for students to practice Math Kangaroo questions for their grade, built with Bootstrap 5. Hosted at https://varun.khaneja.org/mathroo/

## Features
- Grade selection (1-2, 3-4, 5-6).
- Random selection of 20 questions per practice set.
- **Guarantee that at least 2 visual questions and exactly 5 hard questions are included in every set.**
- Permalinks to share specific practice sets.
- Dark and light modes (Dark mode default using Bootstrap 5.3 features).
- **Hard Question Indicator**: Visual cue (🌟 Hard Question) for challenging problems.
- **Gamification**: Timer and badges for accuracy and speed, plus a special "Brainiac" badge for hard questions.
- **PWA Support**: Installable as a Progressive Web App with offline support.
- **Mobile Friendly**: Responsive design powered by Bootstrap.
- **Analytics**: Integrated with Cloudflare Web Analytics.
- **History**: Keep track of past attempts and scores in local storage, with options to delete individual items or clear all.
- **Feedback**: Wrong answers are highlighted upon submission, and explanations are provided for selected questions.

## Data
- `questions.json`: Contains the pool of over 400 questions.
- `samples/`: Contains sample question and solution PDFs downloaded from Math Kangaroo websites.
    - Files named `*_Ecolier.pdf` are for Grade 3-4.
    - Files named `*_Benjamin.pdf` are for Grade 5-6.
    - Other files cover various grades and years.

## How to Run
Open `index.html` in a web browser.