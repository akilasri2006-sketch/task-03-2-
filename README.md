🔷 Tricta — Tic-Tac-Toe Web Application

🎯A modern tic-tac-toe game with a glassmorphic 2026-style interface, built with vanilla HTML, CSS, and JavaScript.
Built for **SkillCraft Technology** Web Development Internship — **Task 03**.

---

🔷Features

- **Two game modes** — play locally against a friend, or challenge the computer
- **Unbeatable AI** — the computer opponent uses the **minimax algorithm**, so it never loses (best case for you: a draw)
- **Live scoreboard** — tracks X wins, O wins, and draws across rounds, with the active player highlighted
- **Animated win line** — an SVG line draws itself across the winning combination
- **Glassmorphic UI** — frosted-glass card, gradient text/buttons, ambient floating background orbs
- **Micro-interactions** — marks animate in with a stroke-draw effect, buttons respond to taps, toast notifications confirm round results
- **Fully responsive & accessible** — scales to mobile, keyboard-focusable cells, `prefers-reduced-motion` respected

🔷Tech Stack

| Layer | Choice |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Plain CSS (custom properties, backdrop-filter, no framework) |
| Logic | Vanilla JavaScript (ES6, minimax AI, no libraries) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (headings) + [Inter](https://fonts.google.com/specimen/Inter) (UI) |

🔷 Project Structure

```
tictactoe-web-app/
├── index.html      # Markup
├── style.css       # Styling
├── script.js       # Game logic + AI
└── README.md
```

🔷 Getting Started

No build step required.

```bash
git clone https://github.com/<your-username>/tictactoe-web-app.git
cd tictactoe-web-app
open index.html     # or just double-click the file
```

🔷How the AI Works

The computer opponent (`O`) uses **minimax**, a recursive decision-making algorithm that simulates every possible sequence of remaining moves, scores each resulting game state (win/loss/draw), and picks the move that guarantees the best outcome assuming the opponent also plays optimally. Because tic-tac-toe's search space is small (at most 9! states), this runs instantly and makes the AI mathematically unbeatable.

🔷 Acknowledgements

Task brief provided by **SkillCraft Technology**.

---

*Part of my SkillCraft Technology internship submissions.*
