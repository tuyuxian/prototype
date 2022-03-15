/*
 * action types
 */
export const REGISTER = "REGISTER";
/*
 * action creator
 */
export function registerAction(values) {
    return { type: REGISTER, values };
}
