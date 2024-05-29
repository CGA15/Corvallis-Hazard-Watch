### Application Architecture

The application follows a component-based architecture built on React.js. It consists of the following major components:

- `App`: Main component responsible for routing and managing the application state.
- `HomePage`, `AboutPage`, `MapPage`, `DataView`, `AuthorizationPage`: Individual pages/routes of the application.
- `MapPage`: Contains `hazardControl` and `hazard` objects for  keeping track of hazards and for filtering data.

### Data Flow

- Data flows from the server to the Redux store to various components for rendering and updating.
- The `MapPage` component interacts with the `hazardControl` and `hazard` objects to display and manipulate map data.