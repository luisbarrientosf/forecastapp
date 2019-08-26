import socketIOClient from 'socket.io-client';
import { SOCKET_URL } from '../configs/env.js';

var socket = socketIOClient(SOCKET_URL);

export default socket;