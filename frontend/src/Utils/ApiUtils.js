export default class ApiUtil {
    static URL_IP = 'http://127.0.0.1:5000';
    //static URL_ROOT = '/';

    static API_Login_Post = '/Login';
    static API_Register_Post = '/Register';
    static API_ResetPassword_Post = '/Reset';
    static API_ForgetPassword_Post = '/Forget';
    static API_Attendance_Get = '/Attendance/c4f55a14-0f4b-4241-8764-1bbbeffe064e';
    static API_newAttendance_Post = '/Attendance/create';
    static API_updateAttendanceNote_Put = '/Attendance/note';
    static API_updateAttendanceCheck_Put = '/Attendance/check';
}