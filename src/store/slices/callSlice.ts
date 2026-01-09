import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface CallState {
  incomingCall: {
    callId: string;
    from: User;
    offer: any;
    type: 'video' | 'audio';
  } | null;
  activeCall: {
    callId: string;
    user: User;
    type: 'video' | 'audio';
    status: 'connecting' | 'connected' | 'ended';
  } | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isMuted: boolean;
  isVideoOff: boolean;
}

const initialState: CallState = {
  incomingCall: null,
  activeCall: null,
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isMuted: false,
  isVideoOff: false,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<CallState['incomingCall']>) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    setActiveCall: (state, action: PayloadAction<CallState['activeCall']>) => {
      state.activeCall = action.payload;
    },
    updateCallStatus: (state, action: PayloadAction<'connecting' | 'connected' | 'ended'>) => {
      if (state.activeCall) {
        state.activeCall.status = action.payload;
      }
    },
    clearActiveCall: (state) => {
      state.activeCall = null;
      state.localStream = null;
      state.remoteStream = null;
      state.peerConnection = null;
      state.isMuted = false;
      state.isVideoOff = false;
    },
    setStream: (state, action: PayloadAction<{ type: 'local' | 'remote'; stream: any }>) => {
      if (action.payload.type === 'local') {
        state.localStream = action.payload.stream;
      } else {
        state.remoteStream = action.payload.stream;
      }
      },
    setPeerConnection: (state, action: PayloadAction<any>) => {
      state.peerConnection = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleVideo: (state) => {
      state.isVideoOff = !state.isVideoOff;
    },
  },
});

export const {
  setIncomingCall,
  clearIncomingCall,
  setActiveCall,
  updateCallStatus,
  clearActiveCall,
  setStream,
  setPeerConnection,
  toggleMute,
  toggleVideo,
} = callSlice.actions;

export default callSlice.reducer;
