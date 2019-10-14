const initState = {
    objectMesh: [],
    objectData: []
}
export default (state = initState, action) => {
    switch(action.type) {
        case "ADD_OBJECT_MESH": 
            return {...state, objectMesh: action.objectMesh};
        case "UPDATE_DATA":
            return {...state,objectData: action.objectData}
        default:
            return state;
    } 
}