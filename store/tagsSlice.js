import { createSlice } from '@reduxjs/toolkit';
import { removeListItem } from './listSlice';
import { sessionEnded } from './sessionActions';

const initialState = {
  byItemId: {}, // { [itemId]: { latitude, longitude, taggedAt } }
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    tagSet: {
      reducer(state, action) {
        state.byItemId[action.payload.itemId] = action.payload.tag;
      },
      // "prepare" is the one place where impure work (reading the clock) is allowed.
      prepare(itemId, { latitude, longitude }) {
        return {
          payload: { itemId, tag: { latitude, longitude, taggedAt: new Date().toISOString() } },
        };
      },
    },
    tagCleared(state, action) {
      delete state.byItemId[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // When an item is deleted from the list, its tag has no reason to stay.
      .addCase(removeListItem.fulfilled, (state, action) => {
        delete state.byItemId[action.meta.arg.id];
      })
      .addCase(sessionEnded, () => initialState);
  },
});

export const { tagSet, tagCleared } = tagsSlice.actions;
export default tagsSlice.reducer;

export const selectTags = (state) => state.tags.byItemId;
