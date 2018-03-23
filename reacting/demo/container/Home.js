// import React from 'react';
import React from '../reacting';
// import React from 'luy';

import PlotBoard from '../component/PlotBoard';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            boardData: ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'iii', 'jj'],
        }
    }

    render() {

        const {boardData} = this.state;
        return (
            <div>
                <PlotBoard boardData={boardData}/>
            </div>
        );
    }

}

export default Home;
