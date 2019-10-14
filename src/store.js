import { createStore } from 'redux';
import Reducer from './modal/reducer/index.js';

const store = createStore(Reducer);

export default store;