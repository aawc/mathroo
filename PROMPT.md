# Prompt to Recreate Math Kangaroo Practice Website

Generate a complete, functional static website for students to practice Math Kangaroo questions, based on the following detailed specifications.

## Tech Stack
- HTML5
- CSS3 (with CSS variables for theming)
- Vanilla JavaScript (no external libraries)

## Core Features

1.  **Grade Selection**:
    - Support grades "1-2", "3-4", and "5-6".
    - Loading the page should show a setup screen where the user selects a grade.

2.  **Question Loading & Selection**:
    - Load questions from a local `questions.json` file (see structure below).
    - For the selected grade, pick 10 questions from the pool.
    - **Guarantee that at least 2 visual questions (type 'grid' or 'grid-match') are included in the set of 10, if available.**
    - Implement a custom Pseudo-Random Number Generator (PRNG) in JS (e.g., LCG) that uses a seed to ensure reproducible random selections.

3.  **Permalinks**:
    - Generate a shareable URL (permalink) for each practice set containing the `grade` and the `seed` as query parameters (e.g., `?grade=3-4&seed=12345`).
    - If the page is loaded with these parameters, it should automatically load the exact same 10 questions.
    - Provide a readonly input field showing the permalink and a "Copy Link" button.

4.  **HUD (Heads Up Display)**:
    - Show the current time elapsed since the start of the quiz.
    - Show the live score (how many answers are currently correct among selected ones).
    - Add a "Pause" button next to the timer. When clicked:
        - The timer should stop.
        - The questions should be hidden to prevent reading them while paused.
        - The button text should change to "Resume".

5.  **Gamification & Results**:
    - Upon clicking "Submit Answers", show the final score and time taken.
    - Award badges based on performance:
        - **Perfect Score** (Gold): 10/10 correct.
        - **Sharpshooter** (Silver): At least 8/10 correct.
        - **Speed Demon** (Bronze): Completed in less than 120 seconds with at least 5/10 correct.
    - Display earned badges with emojis (🏆, 🥈, 🥉).

6.  **Theming**:
    - Support light and dark modes.
    - **Dark mode must be the default** when loading the page.
    - Provide a toggle button to switch between themes.

## Design & Styling
- Use rounded corners on cards, buttons, and inputs.
- Add subtle shadows and hover lift effects on question cards.
- **Fonts**: Use standard sans-serif fonts (e.g., Arial, Helvetica).
- **Color Palette**:
    - **Light Mode**: Soft pastel blue background (`#e8f4f8`), white cards, dark blue-grey text (`#2c3e50`), bright orange accents (`#ff7f50`), amethyst purple for HUD (`#9b59b6`).
    - **Dark Mode**: Dark blue-grey background (`#2f3640`), dark grey cards (`#353b48`), light text (`#f5f6fa`), bright blue accents (`#00a8ff`), bright green secondary (`#4cd137`).

## Data Structure (`questions.json`)
Provide a JSON file containing a list of objects with this structure:
```json
[
  {
    "id": 1,
    "grade": "1-2",
    "question": "Question text here...",
    "options": ["Opt1", "Opt2", "Opt3", "Opt4", "Opt5"],
    "answer": "CorrectOpt"
  },
  {
    "id": 2,
    "grade": "3-4",
    "type": "grid",
    "question": "Question with grid visual...",
    "options": ["A", "B", "C", "D", "E"],
    "data": {
      "A": [[1,0],[0,1]],
      "B": [[1,1],[0,0]]
    },
    "answer": "A"
  },
  {
    "id": 3,
    "grade": "3-4",
    "type": "image",
    "question": "Question with external image...",
    "options": ["A", "B", "C", "D", "E"],
    "image": "images/some_image.png",
    "answer": "B"
  }
]
```
Please generate at least 5 sample questions for each grade level (1-2, 3-4, 5-6) inspired by typical Math Kangaroo word problems and logic puzzles.

## Output Files
Please generate the following files:
- `index.html`
- `style.css`
- `script.js`
- `questions.json`
