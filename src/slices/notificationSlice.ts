import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum NotificationType {
    success = "success",
    error = "error",
    info = "info",
    warning = "warning",
}

type Notification = {
    id: string;
    message: string;
    type: NotificationType;
};

type ShowNotification = Omit<Notification, "open">;

const initialState ={
    open : false,
    message : "",
    type : NotificationType.success,
}

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers : {
        showNotification(state, action : PayloadAction<ShowNotification>){
            state.open = true;
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        hideNotification(state){
            state.open = false;
            state.message = "";
        }
    }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;