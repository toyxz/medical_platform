import React from 'react';
import { connect } from 'react-redux';
import  Spin  from 'antd/es/spin';
import 'antd/dist/antd.css';
import './index.scss'
// test data
const data = [
    {"name":"胆管","filePath":"./data/yixianai1/danguan.stl","color":"#018006","opacity":1,"visible":true,"volume":"0.00ml"},
    {"name":"动脉","filePath":"./data/yixianai1/dongmai.stl","color":"#e7282e","opacity":1,"visible":true,"volume":"0.00ml"},
    {"name":"肝脏","filePath":"./data/yixianai1/ganzang.stl","color":"#8d7a3a","opacity":0.5,"visible":true,"volume":"0.00ml"},
    {"name":"门静脉","filePath":"./data/yixianai1/menjingmai.stl","color":"#28bfe5","opacity":1,"visible":true,"volume":"0.00ml"},
    {"name":"脾脏","filePath":"./data/yixianai1/pizang.stl","color":"#447c76","opacity":0.5,"visible":true,"volume":"0.00ml"},
    {"name":"腔静脉","filePath":"./data/yixianai1/qiangjingmai.stl","color":"#0400bf","opacity":1,"visible":true,"volume":"0.00ml"},
    {"name":"胰腺","filePath":"./data/yixianai1/yixian.stl","color":"#c77acb","opacity":0.5,"visible":true,"volume":"0.00ml"},
    {"name":"占位","filePath":"./data/yixianai1/zhanwei.stl","color":"#ffff00","opacity":1,"visible":true,"volume":"0.00ml"}];

@connect(
    state => ({
        objectData: state.MedicalThreeReducer.objectData,
        objectMesh: state.MedicalThreeReducer.objectMesh
    })
)
class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="loading-wrapping">
                <Spin 
                    tip={this.props.objectMesh.length}
                    className="loading"
                    size="large"
                />
            </div>

        )
    }
}
export default Loading;