// import React from 'react';
import React from '../reacting';
// import React from 'luy';

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            headerMenu: ['饼状图', '折线图', '条形图','散点图', '其他图'],
        }
    }

    render() {

        const {headerMenu} = this.state;
        const styleBtn = {
            // width: '72px',
            // height: '36px',
            padding: '12 36',
            margin: '8 24',
            color: '#fff',
            backgroundColor:'#777',
            border:'none',
            borderRadius:'4px',
            cursor: 'pointer',
            fontSize:'1.1rem',

    }
        return (
            <div>
                {headerMenu.map(function (item, i) {
                    return <button style={styleBtn} key={i} type="button">{item}</button>
                })}
            </div>
        );
    }

}


export default Header;
