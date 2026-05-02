export const setGlobalLoading = (status) => ({
  type: "SET_GLOBAL_LOADING",
  payload: status
});

export const toggleSidebar = () => ({
  type: "TOGGLE_SIDEBAR"
});

export const setTheme = (theme) => ({
  type: "SET_THEME",
  payload: theme
});
