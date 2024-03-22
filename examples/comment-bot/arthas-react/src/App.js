import PersonaManager from './pages/PersonaManager';
import Topics from './pages/Topics';
import Topic from './pages/Topic';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

const App = () => {
  const { pathname } = window.location;

  switch (pathname) {
    case '/forum':
      return (
        <div id="forum">
          <Topics timeAgo={timeAgo} />
        </div>
      );
    case '/forum/topic':
      return (
        <div id="forum">
          <Topic timeAgo={timeAgo} />
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
