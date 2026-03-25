**PhishSkope** is a gamified cybersecurity awareness prototype.

This is for testing purposes only, currently completely local

For a deep-dive audit of the React state and component structure:

1. **Prerequisites:** [Node.js](https://nodejs.org/) (v16+) and `npm` or `yarn`.
2. **Install:** `npm install`.
3. **Launch:** `npm start`.
4. **Tools:** Use **React Developer Tools** to monitor the `xp`, `streak`, and `foundIoCs` states in real-time.

##  Architecture Overview

* **`src/App.tsx`**: Contains the monolithic game engine, state management, and the `EMAIL_DATABASE`.
* **`src/styles.css`**: Manages the dynamic theme switching and magnifier animations.

##  White Hat Disclaimer
This prototype is for sanctioned, "white hat" training purposes only. Auditors must focus on defense through education. Do not submit actual malicious code or live credential harvesting links to this repository.
