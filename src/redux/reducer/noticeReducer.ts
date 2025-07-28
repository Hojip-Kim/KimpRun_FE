import { createSlice } from '@reduxjs/toolkit';
import { NoticeState } from '../type';

const initialState: NoticeState = {
  notice: [],
  isNewNoticeGenerated: false,
};

const noticeSlices = createSlice({
  name: 'notice',
  initialState: initialState,
  reducers: {
    setNotice: (state, action) => {
      state.notice = action.payload;
    },
    setIsNewNoticeGenerated: (state, action) => {
      state.isNewNoticeGenerated = action.payload;
    },
  },
});

export const { setNotice, setIsNewNoticeGenerated } = noticeSlices.actions;
export default noticeSlices.reducer;
