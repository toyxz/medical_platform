import React from 'react';
import  Card  from 'antd/es/card';
import './index.scss'

class BackgroundButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: 0x222222
        }
    }
    changeBackground() {
        const { renderer, controls, scene, camera } = this.props;
		controls.enabled = true;

        if (this.state.backgroundColor === 0x222222) {
            this.setState({
                backgroundColor: 0xeeeeee
            })
        } else {
            renderer.setClearColor( 0x222222 );
            this.setState({
                backgroundColor: 0x222222
            })
        }
        renderer.setClearColor( this.state.backgroundColor );
        controls.update();
        renderer.render(scene, camera);
    }

    render() {
        return (
                <Card 
                    className="control-button"
                    onClick={() => this.changeBackground()}
                >
                    <div className="apparatus-name">背景</div>
                </Card>
        )
    }
}
export default BackgroundButton;



