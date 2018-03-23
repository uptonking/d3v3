// import React from 'react';
import React from '../reacting';
// import React from 'luy';

class PlotBoard extends React.Component {

    // constructor() {
    //     super();
    //     this.state = {
    //         headerMenu: ['饼状图', '折线图', '条形图', '其他图'],
    //     }
    // }

    render() {

        const {boardData} = this.props;
        const styleBoard = {
            width: '480',
            height: '320',
            backgroundColor: '#eee',
            float: 'left',
            textAlign: 'center',
            margin: '6 24',
        };

        return (
            <div>
                {boardData.map(function (item, i) {
                    return <div key={i} style={styleBoard}>
                        <h2>{item}</h2>
                    </div>
                })}
            </div>
        );
    }

}


export default PlotBoard;
