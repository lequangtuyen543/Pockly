import './App.css';
import AllRoute from './components/AllRoute';
import { SettingsProvider } from './context/SettingsContext';
import { AppInitializer } from './AppInitializer';

function App() {
  return (
    <SettingsProvider>
      <AppInitializer>
        <AllRoute />
      </AppInitializer>
    </SettingsProvider>
  );
}

export default App;