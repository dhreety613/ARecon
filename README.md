# Drone Intelligence System
## A*Recon
A real-time autonomous drone navigation system with:
- surveillance-driven input ingestion
- YOLO-based obstacle detection
- terrain difficulty analysis
- live weather integration
- A* / Dijkstra route planning
- mission execution
- dynamic replanning
- frontend geo-map visualization


## HOW TO RUN

### backend
cd backend
uvicorn app.main:app --reload
#### for swagger UI
http://127.0.0.1:8000/docs

### frontend
cd frontend
npm install
npm run dev
#### local host
http://localhost:5173

### Required Environment Variables
Create a .env file inside backend/:
WEATHER_API_KEY=your_openweather_api_key


## SYSTEM FLOW
Surveillance Input
    ↓
Obstacle Detection (YOLO11)
    ↓
Terrain Analysis
    ↓
Weather Analysis
    ↓
Fusion / Risk Scoring
    ↓
Costmap Generation
    ↓
A* / Dijkstra Route Planning
    ↓
Mission Creation
    ↓
Live Replanning


## FEATURES

### Backend
- FastAPI-based API server
- YOLO11 object detection
- weather risk scoring using Weather API
- terrain analysis using elevation-based difficulty estimation
- route planning with A* / Dijkstra
- mission creation and execution
- live replanning with adjusted route output

### Frontend
- Welcome page
- Signup / Login
- Home control page
- Analysis dashboard
- Missions page with route map
- Live Mission page with:
  - original route
  - adjusted dashed route
  - moving drone marker


## Tech Stack
### Backend
- FastAPI
- Pydantic
- Uvicorn
- Ultralytics YOLO11
- OpenCV
- NumPy
- Requests

### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
- Leaflet
- React-Leaflet

---
## Pages
1. Welcome
Landing page for the app.

2. Auth
Signup and login page.

3. Home
Navigation hub with buttons to:
Analysis
Missions
Live Mission

4. Analysis
Runs obstacle, terrain, and weather analysis.

5. Missions
Shows planned route on geo map.

6. Live Mission
Shows:
original route
adjusted route
moving drone marker
replanning updates


## Project Structure
Drone/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analysis.py
│   │   │   ├── auth.py
│   │   │   ├── mission.py
│   │   │   ├── planning.py
│   │   │   ├── replanning.py
│   │   │   └── surveillance.py
│   │   │
│   │   ├── core/
│   │   │   └── config.py
│   │   │
│   │   ├── models/
│   │   │   └── mission.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── analysis.py
│   │   │   ├── auth.py
│   │   │   ├── mission.py
│   │   │   ├── replanning.py
│   │   │   ├── route.py
│   │   │   └── surveillance.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── costmap_generation_service.py
│   │   │   ├── dynamic_replanning_service.py
│   │   │   ├── fusion_service.py
│   │   │   ├── global_route_planning_service.py
│   │   │   ├── local_obstacle_service.py
│   │   │   ├── local_weather_service.py
│   │   │   ├── mission_execution_service.py
│   │   │   ├── obstacle_detection_service.py
│   │   │   ├── preprocessing_service.py
│   │   │   ├── surveillance_ingestion_service.py
│   │   │   ├── terrain_analysis_service.py
│   │   │   ├── weather_analysis_service.py
│   │   │   └── weather_api_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── geo_utils.py
│   │   │   ├── graph_utils.py
│   │   │   ├── image_utils.py
│   │   │   └── terrain_utils.py
│   │   │
│   │   └── main.py
│   │
│   ├── ml/
│   │   └── object_detection/
│   │       ├── infer.py
│   │       └── model_loader.py
│   │
│   ├── models/
│   │   └── yolo11n.pt
│   │
│   ├── data/
│   │   ├── raw/
│   │   │   ├── drone_stats/
│   │   │   ├── surveillance_images/
│   │   │   ├── surveillance_videos/
│   │   │   └── weather/
│   │   └── processed/
│   │       ├── frames/
│   │       └── normalized_images/
│   │
│   └── test.jpg
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LiveMissionMap.tsx
│   │   │   └── RouteMap.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Analysis.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── LiveMission.tsx
│   │   │   ├── Missions.tsx
│   │   │   ├── Surveillance.tsx
│   │   │   └── Welcome.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

## API ROUTES
### Auth
POST /api/v1/auth/signup
POST /api/v1/auth/login
### Surveillance
POST /api/v1/surveillance/image
POST /api/v1/surveillance/video
POST /api/v1/surveillance/telemetry
POST /api/v1/surveillance/weather
### Analysis
POST /api/v1/analysis/image
Planning
POST /api/v1/planning/route
### Mission
POST /api/v1/mission/create
GET /api/v1/mission/{mission_id}
GET /api/v1/mission/
POST /api/v1/mission/{mission_id}/start
POST /api/v1/mission/{mission_id}/pause
POST /api/v1/mission/{mission_id}/advance
POST /api/v1/mission/{mission_id}/fail
### Replanning
POST /api/v1/replanning/local


