import React from 'react';
import { connect } from 'react-redux';
import  Card  from 'antd/es/card';
import './index.scss'

@connect(
    state => ({
        objectData: state.MedicalThreeReducer.objectData,
        objectMesh: state.MedicalThreeReducer.objectMesh
    })
)
class OperacityButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacityText: null,
        }
    }
    changeOperacity() {
        const { renderer, camera, scene, controls, objectMesh, medicalIndex } = this.props;
        controls.enabled = true;
        objectMesh[medicalIndex].material.transparent = true;
        if (objectMesh[medicalIndex].material.opacity < 1) {
            objectMesh[medicalIndex].material.opacity += 0.25;
        } else {
            objectMesh[medicalIndex].material.opacity = 0;
        }
        this.setState({
            opacityText: objectMesh[medicalIndex].material.opacity,
        });
        controls.update();
        renderer.render(scene, camera);
        // objects[o].material.color.set(colors[files[modelindex[o]].name]);
    }

    onMouseOver() {
        const { controls } = this.props;
		controls.enabled = false;
    }

    onMouseOut() {
        const { controls } = this.props;
		controls.enabled = true;
    }

    onTouchEnd() {
        const { controls } = this.props;
        controls.enabled = true;
    }

    onTouchMove() {
        const { controls } = this.props;
        controls.enabled = false;
    }

    onTouchStart() {
        const { controls } = this.props;
        controls.enabled = false;
    }

    handleOpacity() {
        if (this.state.opacityText !== null) {
            return this.state.opacityText * 100;
        } 
        return 0;
    }

    render() {
        const { medicalIndex } = this.props;
        return (
            <div>
                {this.props.objectData.length!==0 ? <Card 
                    className="control-button"
                    onClick={() => this.changeOperacity()}
                    style={{backgroundColor:this.props.objectData[medicalIndex].color}}
                    onMouseOver={() => this.onMouseOver()}
                    onMouseOut={() => this.onMouseOut()}
                    onTouchEnd ={() => this.onTouchEnd()}
                    onTouchMove ={() => this.onTouchMove()}
                    onTouchStart={() => this.onTouchStart()}
                >
                    <div className="apparatus-percent">{this.handleOpacity()}%</div>
                    <div className="apparatus-name">{this.props.objectData[medicalIndex].name}</div>
                    <div className="apparatus-volumn">{this.props.objectData[medicalIndex].volume}</div>
                </Card>: ''}
            </div>
        )
    }
}
export default OperacityButton;