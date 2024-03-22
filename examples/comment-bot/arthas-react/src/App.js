import PersonaManager from './pages/PersonaManager';
import Topics from './pages/Topics';
import Topic from './pages/Topic';

const App = () => {
  const { pathname } = window.location;

  switch (pathname) {
    case '/forum':
      return (
        <div id="forum">
          <Topics />
        </div>
      );
    case '/forum/topic':
      return (
        <div id="forum">
          <Topic />
        </div>
      );
    default:
      return (
        <div id="persona-manager">
          <PersonaManager />
        </div>
      );
  }
};

export default App;
