<div align="center">
  <br />
  <h1>🌐 LODESTAR Frontend Dashboard</h1>
  <p>
    A dynamic, responsive frontend prototype for the <b>LODESTAR (Low-cost Disaster & Emergency Services for Communities At Risk)</b> project.
  </p>
  <a href="https://dheerajpapani.github.io/lodestar-dashboard/"><strong>View Live Demo »</strong></a>
  <br />
  <br />
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#core-features">Core Features</a></li>
    <li><a href="#technology-stack">Technology Stack</a></li>
    <li><a href="#dashboard-preview">Dashboard Preview</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#contact--credits">Contact & Credits</a></li>
  </ol>
</details>

---

## **About The Project**

LODESTAR is a collaborative India-Netherlands research initiative designed to co-create a low-cost, multi-hazard early warning system (MH-EWS) for floods and droughts. This repository contains the source code for the project's primary user interface: a modern, responsive frontend dashboard.

The dashboard's core mission is to serve as a proof-of-concept for bridging the critical "know-do gap" in disaster management. It achieves this by presenting complex scientific data—such as real-time alerts, forecasts, and hydrological models—in a clear, accessible, and actionable format. It is designed to be a central hub for all project stakeholders, from citizens and community leaders to disaster management professionals and policy actors.

The entire application is built on the philosophy of co-creation, integrating advanced technology (AI/ML, remote sensing) with a bottom-up, community-focused approach through "Living Labs" and "Citizen Science".

---

## **Core Features**

✨ **Modern & Liquid Layout:** A fully responsive design that dynamically adjusts to all screen sizes, from mobile phones to large desktops, ensuring a seamless user experience.

🗺️ **Interactive Geo-Dashboard:** A central map page built with **MapLibre GL** for visualizing the project's international study sites, complete with interactive weather overlays and a detailed side panel for site-specific data.

🔔 **Dynamic Alert Center:** An interactive and filterable interface for viewing real-time, multi-hazard early warnings. Each alert is presented with clear severity indicators and actionable recommendations.

🔬 **Rich Content Pages:** Detailed, animated pages for every core aspect of the project—from the in-depth "About" page with its editorial-style layout to the comprehensive "Team" showcase.

🎨 **User-Selectable Theming:** A polished, persistent light/dark mode theme toggle, featuring a custom sun-and-moon animation, which remembers the user's preference across sessions.

🚀 **Fast & Performant:** Built with **Vite** and **React**, ensuring a lightning-fast development experience and a highly optimized production build.

 MOTION **Elegant Animations:** Subtle and professional animations using **Framer Motion** are integrated throughout the application to enhance the user experience and guide the user's focus.

---


## Internal Admin Portal

The website includes an internal access portal accessible via the "Internal Portal" navigation menu. 
**Note:** This access point requires an active IITG VPN connection as it leads to an internal-only application. This website serves only as a launchpad and does not handle any credentials or database access directly.

## **Technology Stack**

This dashboard is built with a curated selection of modern frontend technologies:

| Technology | Purpose |
| :--- | :--- |
| **React** | Core UI Library |
| **Vite** | Build Tool & Dev Server |
| **React Router** | Client-Side Routing |
| **MapLibre GL** | Interactive Mapping |
| **Recharts** | Data Visualization & Charts |
| **Framer Motion**| Page & Component Animations |
| **CSS Variables** | Theming & Styling |

---

## **Getting Started**

To get a local copy up and running, please follow these steps.

### **Prerequisites**

Ensure you have [Node.js](https://nodejs.org/) (version 16 or later) and `npm` installed on your machine.

### **Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/dheerajpapani/lodestar-dashboard.git](https://github.com/dheerajpapani/lodestar-dashboard.git)
    ```
2.  **Navigate into the frontend project directory:**
    ```sh
    cd lodestar-dashboard/frontend
    ```
3.  **Install all necessary NPM packages:**
    ```sh
    npm install
    ```
4.  **Run the local development server:**
    ```sh
    npm run dev
    ```
    Your application will now be running and accessible at `http://localhost:5173/` (or the next available port).

---

## **Deployment**

This project is built for production and can be deployed to any static site hosting service (e.g., Vercel, Netlify, AWS S3, GitHub Pages).

1.  **Build the Project:** From the `frontend` directory, run the build command.
    ```sh
    npm run build
    ```
    This will create a production-ready `dist` folder.

2.  **Deploy:** Upload the contents of the `dist` folder to your hosting provider of choice. For GitHub Pages, you can use the built-in deploy script:
    ```sh
    npm run deploy
    ```

---

## **Acknowledgments**

This project is a visualization of the LODESTAR initiative, which is proudly funded by:
* **Department of Science and Technology (DST), Government of India**
* **Dutch Research Council (NWO), The Netherlands**

---

## **Contact & Credits**

This frontend dashboard was designed and developed by:

**Dheeraj Papani**

* **Email:** [dheerajpapani@gmail.com](mailto:dheerajpapani@gmail.com)
* **LinkedIn:** [linkedin.com/in/dheeraj-papani-507693274](https://www.linkedin.com/in/dheeraj-papani-507693274/)
* **GitHub:** [github.com/dheerajpapani](https://github.com/dheerajpapani/)
