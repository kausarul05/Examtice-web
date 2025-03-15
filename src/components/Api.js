export const API_BASE_URL = "https://www.examtice.com/backend/api/"; //Examtice Live api
//export const API_BASE_URL = "https://examtice.codexade.com/backend/api/"; //Development api
//export const API_BASE_URL = "http://localhost/exam-frontend/examtice.com-backend/api/"; //local api
export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;
export const GET_COURSES = getApiUrl("getCourses");
export const GET_SUBJECTS = getApiUrl("getCourseSubjects");
export const GET_YEAR = getApiUrl("getSubjectsYear");
export const GET_SUBJECTS_LIST = getApiUrl("getSubjectsList");
export const GET_TOPICS = getApiUrl("getSubjectsTopics");
export const GET_TOPICS_LIST = getApiUrl("getSubjectsTopicsList");
export const GET_QUESTIONS = getApiUrl("getQuestions");
export const GET_LMS_EXAM_QUESTIONS = getApiUrl("getLmsExamQuestions");
export const CREATE_EXAM = getApiUrl("createLmsExam");
export const SAVE_QUESTIONS = getApiUrl("save_test_data");
export const SAVE_FEEDBACK_QUESTION = getApiUrl("save_feedback_question");
export const SEARCH_QUESTION = getApiUrl("searchquestion");
export const SEARCH_QUESTIONBYID = getApiUrl("searchquestionbyid");
export const SAVE_USER_TEST = getApiUrl("save_user_test");
export const GET_SAVED_TEST_QUESTIONS = getApiUrl("get_saved_test_questions");
export const TEST_REPORT = getApiUrl("report");
export const SAVE_TIME = getApiUrl("saveTime");
export const GET_SAVED_TEST = getApiUrl("get_saved_test");
export const REMOVED_SAVED_TEST = getApiUrl("remove_saved_test");
export const LOGIN = getApiUrl("login");
export const LOGOUT = getApiUrl("logout");
export const REGISTER = getApiUrl("register");

export const REGISTER_AFFILIATE = getApiUrl("registerAffiliate");
export const LOGIN_AFFILIATE = getApiUrl("loginAffiliate");
export const GET_AFFILIATE_REQUEST = getApiUrl("Affiliaterequest");

export const REGISTER_LMS = getApiUrl("registerLMS");
export const LOGIN_LMS = getApiUrl("loginLMS");
export const WITHDRAW_AMOUNT = getApiUrl("withdrawAmount");

export const ABOUT_HOME = getApiUrl("about-us/home")
export const TEAM_LEAD = getApiUrl("about-us/teamlead")
export const ABOUT_US = getApiUrl("about-us/main")
export const ABOUT_WHY_US = getApiUrl("about-us/why")
export const HOME_PAGE_SLIDER = getApiUrl("slider")
export const HOME_PAGE_VIDEO = getApiUrl("videos")
export const FAQ = getApiUrl("faq/list")
export const TERMS_AND_CONDITION = getApiUrl("terms-condition")
export const FORGET = getApiUrl("forget");
export const GET_REPORTS = getApiUrl("reports");
export const GET_LMS_STUDENTREPORTS = getApiUrl("lmsstudentreports");
export const GET_COURSES_GRAPH = getApiUrl("monthlyReport/Course");
export const GET_RESET_GRAPH = getApiUrl("resetGraph");
export const GET_MONTHLY_REPORT = getApiUrl("monthlyReport");
export const GET_REFRESH_TOKEN = getApiUrl("refresh");
export const GET_COURSE_DETAIL = getApiUrl("getCourseDetail");
export const GET_LATEST_BLOGS = getApiUrl("getLatestBlogs");
export const GET_TESTIMONIALS = getApiUrl("getTestimonials");
export const USER_SUBSCRIBE = getApiUrl("subscribe");
export const USER_STUDENTS = getApiUrl("getStudentList");
export const PAYMENT_VERIFY = getApiUrl("verify");
export const GET_SINGLE_BLOG = getApiUrl("getSingleBlog");
export const VERIFY_USER = getApiUrl("verify");
export const RESET_USER = getApiUrl("verify_reset");
export const RESET_USER_PASSWORD = getApiUrl("reset_password");
export const EDIT_PROFILE = getApiUrl("edit_profile");
export const MY_PROFILE = getApiUrl("my_profile");
export const MY_NOTIFICATION = getApiUrl("my_notice");
export const MY_NOTIFICATION_UPDATE = getApiUrl("my_notice_update");
export const MY_SUBSCRIPTION = getApiUrl("my_subscription");
export const MY_SUBSCRIPTION_DETAIL = getApiUrl("my_subscription_detail");
export const CANCEL_SUBSCRIPTION = getApiUrl("cancel_subscription");
export const QUESTION_COMMENT = getApiUrl("questionComment");
export const DELETE_COMMENT = getApiUrl("deleteComment");
export const SAVE_NOTE = getApiUrl("save_note");

// forum apis
export const GET_ALL_TOPIC = getApiUrl("getForumTopic");
export const GET_SINGLE_ALL_TOPIC = getApiUrl("singleTopicList");
export const CREATE_TOPIC = getApiUrl("createTopic");
export const DELETE_TOPIC = getApiUrl("deleteTopic");
export const CHANGE_STATUS_TOPIC = getApiUrl("changeTopicStatus");
export const GET_SINGLE_TOPIC = getApiUrl("getSingleTopic");
export const POST_COMMENT_TOPIC = getApiUrl("postComment");

// Flag api
export const FLAG_QUESTION = getApiUrl("flag_question");
export const UNFLAG_QUESTION = getApiUrl("unflag_question");

// Bookmark api
export const BOOKMARK_QUESTION = getApiUrl("bookmark_question");
export const UNBOOKMARK_QUESTION = getApiUrl("unbookmark_question");

// Check instructor assigned test 
export const ATTEMPT_ASSIGNED_TEST = getApiUrl("attempt_assigned_test");

// Affiliate
export const GET_AFFILIATE_DASHBOARD = getApiUrl("affiliate_dashboard");
export const AFFILIATE_SUBSCRIPTION_USERS = getApiUrl("affiliate_subscription_users");
export const AFFILIATE_TRANSACTION = getApiUrl("affiliate_transaction");

//LMS
export const LMS_STUDENTS_LIST = getApiUrl("getLmsStudentList");
export const SEARCH_STUDENTS_BY_EMAIL = getApiUrl("getStudentListbyEmail");
export const LMS_SEND_REQUEST = getApiUrl("lms-requests-send");
export const LMS_USER_BLOCK = getApiUrl("lms-user-block");
export const LMS_USER_ACCEPT = getApiUrl("lms-user-accept");
export const LMS_REQUESTEDSTUDENTS = getApiUrl("requested-students-list");
export const LMS_EXAMLIST_FOR_TEACHER = getApiUrl("get_lms_exam_list_for_teacher");
export const GET_LMS_EXAM_QUESTIONS_START = getApiUrl("lms_exam_for_student_by_exam_id");
export const SAVE_LMS_QUESTIONS = getApiUrl("save_lmsexam_data");
export const LMS_EXAMLIST_FOR_STUDENT = getApiUrl("get_lms_exam_list_for_student");

export const SEARCH_TEACHER_BY_EMAIL = getApiUrl("getTeacherListbyEmail");
export const LMS_TEACHER_SEND_REQUEST = getApiUrl("lms-teacher-requests-send");
export const LMS_TEACHER_ACCEPT_REQUEST = getApiUrl("lms-teacher-accept_request");
export const LMS_TEACHER_BLOCK = getApiUrl("lms-teacher-blog");
export const LMS_REQUESTED_TEACHER = getApiUrl("requested-teacher-list");
export const LMS_EXAM_DETAILS = getApiUrl("get_lms_exam_details");
export const LMS_EXAMSTUDENTS = getApiUrl("get_lms_exam_students");
export const SAVE_LMS_TIME = getApiUrl("saveLmsTime");
export const STUDENT_LMS_EXAM_REPORT = getApiUrl("studentLmsExamReport");

// contact us
export const CONTACT_US = getApiUrl("contact_us");
export const MY_TICKETLIST = getApiUrl("getTicketList");
export const MY_TICKETDETAILS = getApiUrl("getTicketDetails");
export const MY_TICKETCOMMENTSSTORE = getApiUrl("storeTicketComments");
export const MY_TICKETCOMMENTS = getApiUrl("getTicketComments");
export const GET_TICKETSTATUS = getApiUrl("getTicketcategories");
export const CREATE_TICKET = getApiUrl("createticket");


