import React from 'react';
import * as THREE from 'three';
import ControlMenu from '../../component/ControlMenu';
import Loading from '../../component/Loading';
import { connect } from 'react-redux';
const axios = require('axios');
const STLLoader = require('three-stl-loader')(THREE);
const TrackballControls = require('three-trackballcontrols');
let controls = null;

@connect(
    state => ({
        objectData: state.MedicalThreeReducer.objectData,
        objectMesh: state.MedicalThreeReducer.objectMesh
    })
)
class MedicalTree extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 5, 7000 ),
            renderer: new THREE.WebGLRenderer( { antialias: true } ),
        };
    }

    getData() {
        axios.get('http://localhost:3000/mdata')
        .then( response => {
            // handle success
            this.props.dispatch({
                type: 'UPDATE_DATA',
                objectData: [...this.props.objectData,...response.data.result],
            });
            this.getModal();
        })
        .catch( error => {
            // handle error
            console.log(error);
        })
        .finally( () => {
            // always executed
        });
    }

    getModal() {
        var initModal = () => {
            // 场景
            this.state.scene.add( new THREE.AmbientLight( 0x444444 ) );
            //创建相机对象
            this.state.camera.position.set( 30, -300, 0  );//设置相机位置
            this.state.camera.add( new THREE.PointLight( 0xffffff, 1 ) );
            this.state.scene.add( this.state.camera );
            this.state.camera.lookAt(this.state.scene.position);//设置相机方向(指向的场景对象)
            // 创建渲染器对象
            this.state.renderer.setClearColor( 0x222222 );
            this.state.renderer.setPixelRatio( window.devicePixelRatio );
            this.state.renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( this.state.renderer.domElement );
    
    
            
            let loader = new STLLoader();
            this.props.objectData.forEach((item, index) => {
                loader.load(item.filePath,geometry =>  {
                    // 材质
                    var material=new THREE.MeshLambertMaterial( {name:item.name,color: item.color, specular: 0x222222,shininess: 30,shading: THREE.SmoothShading, opacity:item.opacity,visible:true} );//材质对象
                    var mesh=new THREE.Mesh(geometry,material);//网格模型对象
                    mesh.position.set( -150, -200 , 200 ); // 自行设置
                    mesh.rotation.set( 0,  Math.PI / 2, 0 );
    
                    this.state.scene.add(mesh);//网格模型添加到场景中
                    this.props.dispatch({
                        type: 'ADD_OBJECT_MESH',
                        objectMesh: [...this.props.objectMesh,mesh],
                    });
                    //执行渲染操作  渲染操作应该放在这里才能完成。。。！！！！！！！！！！！！！！！！
                    if (this.props.objectMesh.length === this.props.objectData.length) {
                        this.state.renderer.render(this.state.scene,this.state.camera);
                    }
                }, ok =>  {
                    // console.log('ok:',ok);
                }, err => {
                    console.log('err:', err);
                });            
            });

            var onWindowResize = () => {
                this.state.camera.aspect = window.innerWidth / window.innerHeight;
                this.state.camera.updateProjectionMatrix();
                this.state.renderer.setSize( window.innerWidth, window.innerHeight );
                controls.handleResize();
                renderModal();
            }
    
            var renderModal = () => {
                this.state.renderer.render( this.state.scene, this.state.camera );
            }
    
            controls = new TrackballControls( this.state.camera );
            controls.rotateSpeed = 5.0;
            controls.zoomSpeed = 5;
            controls.panSpeed = 2;
            controls.staticMoving = true;
            controls.dynamicDampingFactor = 0.3;
            controls.addEventListener( 'change', renderModal );
            window.addEventListener( 'resize', onWindowResize, false );
        }
        var animate = () => {
            requestAnimationFrame( animate );
            controls.update();
            renderModal();
        }
        var renderModal = () => {
            if (this.props.objectMesh.length === this.props.objectData.length) {
                this.props.objectData.forEach( (item, index) => {
                    // this.props.objectMesh[index].material.color.set();
                    this.props.objectMesh[index].material.transparent=true;
                    this.props.objectMesh[index].material.depthWrite = false;
                })
                this.state.renderer.render( this.state.scene, this.state.camera );
            }
            if (this.props.objectMesh.length && 
                this.props.objectData.length && 
                this.props.objectMesh.length === this.props.objectData.length &&
                this.props.objectData[0].volume === '0.00ml') {
                const tempData = [].concat(this.props.objectData);
                this.props.objectMesh.forEach( (item, index) => {
                    tempData[index].volume = (this.calculateVolume(item)/1000).toFixed(2)+'ml';
                });
                this.props.dispatch({
                    type: 'UPDATE_DATA',
                    objectData: [...tempData],
                });
            };
        }
        if (this.props.objectData.length) {
            initModal();
            animate();
        }
    }

    componentDidMount() {
        this.getData() 
    }

    calculateVolume (object) {
        var volumes = 0;
        object.legacy_geometry = new THREE.Geometry().fromBufferGeometry(object.geometry);
        for(var i = 0; i < object.legacy_geometry.faces.length; i++){
            var Pi = object.legacy_geometry.faces[i].a;
            var Qi = object.legacy_geometry.faces[i].b;
            var Ri = object.legacy_geometry.faces[i].c;
            var P = new THREE.Vector3(object.legacy_geometry.vertices[Pi].x, object.legacy_geometry.vertices[Pi].y, object.legacy_geometry.vertices[Pi].z);
            var Q = new THREE.Vector3(object.legacy_geometry.vertices[Qi].x, object.legacy_geometry.vertices[Qi].y, object.legacy_geometry.vertices[Qi].z);
            var R = new THREE.Vector3(object.legacy_geometry.vertices[Ri].x, object.legacy_geometry.vertices[Ri].y, object.legacy_geometry.vertices[Ri].z);
            volumes += this.signedVolumeOfTriangle(P, Q, R);
        }
        return Math.abs(volumes);
    }

    signedVolumeOfTriangle (p1, p2, p3) {
        var v321 = p3.x*p2.y*p1.z;
        var v231 = p2.x*p3.y*p1.z;
        var v312 = p3.x*p1.y*p2.z;
        var v132 = p1.x*p3.y*p2.z;
        var v213 = p2.x*p1.y*p3.z;
        var v123 = p1.x*p2.y*p3.z;
        return (-v321 + v231 + v312 - v132 - v213 + v123)/6;
    }

    componentWillUpdate() {

    }
    render() {
        return <div>
            {this.props.objectMesh.length !== this.props.objectData.length ? 
            <Loading></Loading> 
            : <ControlMenu 
                renderer={this.state.renderer}
                camera={this.state.camera}
                scene={this.state.scene}
                controls = {controls}
            ></ControlMenu>}
        </div>

    }
}
export default MedicalTree;
