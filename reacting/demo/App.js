// import React from 'react';
import React from './reacting';
// import React from 'luy';

import Home from './container/Home';
import Header from './container/Header';

class App extends React.Component {

    render() {

        return (
            <div>
                <h3>Welcome to App Page.</h3>
                <Header/>
                <Home/>
            </div>
        );
    }

}

export default App;
