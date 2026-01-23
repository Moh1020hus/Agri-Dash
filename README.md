
# AgriDash - Smart Farming Dashboard

AgriDash is a Next.js-based dashboard for monitoring agricultural sensors, weather conditions, and plant phenology. It features a responsive design, interactive charts, and a mock data layer for rapid prototyping.

##  Getting Started (Local Development)

Follow these steps to run the project on your local machine for development.

### Prerequisites

* Node.js 18+ installed.
* npm, yarn, or pnpm.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Moh1020hus/Agri-Dash.git
cd agri-dashboard

```


2. Install dependencies:
```bash
npm install

```


3. Run the development server:
```bash
npm run dev

```


4. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

---

## 🐳 Docker Support

This project is configured for a production-ready **Docker** deployment using a multi-stage build to keep the image size small.

### Prerequisites

* **Docker Desktop** must be installed and running.

### Build the Image

Run this command in the project root to build the Docker image:

```bash
docker build -t agridash .

```

*(Note: This uses the `standalone` output mode configured in `next.config.ts`)*

### Run the Container

Once built, start the container and map it to port 3000:

```bash
docker run -p 3000:3000 agridash

```

Access the app at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

---

##  Project Structure

Here is a quick overview of where to find things:

* **`src/app`**: Contains the App Router pages (Routes).
* `page.tsx`: Main Dashboard.
* `login/`: Login page.
* `fields/[id]/`: Dynamic Field Detail pages.
* `weather/`: Weather forecast page.


* **`src/components`**: Reusable UI components.
* `layout/`: Sidebar, TopBar.
* `sensors/`: Sensor cards and grids.
* `phenology/`: BBCH Tracker and Growth Charts.


* **`src/lib`**: Logic and Data.
* `dummy-data.ts`: **Single Source of Truth** for all mock data (Sensors, Fields, Weather).
* `notification-service.ts`: Generates notifications based on dummy data.



---

##  Styling & Theming

* **Tailwind CSS**: Used for all styling.
* **Light Mode Only**: The project enforces Light Mode via a "Nuclear" override in `src/app/globals.css` and `layout.tsx` to prevent system dark mode preferences from breaking the dashboard design.

## 🛠 Tech Stack

* [Next.js 15](https://nextjs.org/) (App Router)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Recharts](https://recharts.org/) (Data Visualization)
* [Lucide React](https://lucide.dev/) (Icons)
* [Leaflet / React-Leaflet](https://react-leaflet.js.org/) (Maps)