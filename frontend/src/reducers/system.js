const initialState = {
  globalLoading: false,
  sidebarCollapsed: false,
  theme: localStorage.getItem('theme') || 'light'
};

export const systemReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_GLOBAL_LOADING":
      return { ...state, globalLoading: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "SET_THEME":
      localStorage.setItem('theme', action.payload);
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};
