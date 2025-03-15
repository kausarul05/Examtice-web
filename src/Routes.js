import React from "react";
import { useSelector } from "react-redux";
import history from "./history";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
// Importing all pages from index.js
import {
    About,
    Eshop,
    Home,
    Affiliate,
    Learningmanagementsystem,
    Freetest,
    Package,
    Report,
    Dashboard,
    MyProfile,
    MyReports,
    NotFound,
    Verify,
    Callback,
    Subscription,
    SubscriptionDetail,
    Blog,
    Forum,
    Topic,
    SingleTopic,
    ResumeSavedTest,
    AffiliateDashboard,
    Withdraw,
    SubscribeUsers,
    Transaction,
    ContactUs,
    TermsAndCondition,
    AffiliateTermsAndCondition,
} from "./pages";
import { userAuth } from "./features/userSlice";
import ProtectedRoute from "./protected.route";
import AffiliateRoute from "./affiliateRoute";
import BlogSingle from "./pages/BlogSingle";
import Faq from "./pages/Faq";
import SearchandFeedback from "./pages/user/SearchandFeedback";
import Supportlist from "./pages/user/Supportlist";
import DownloadApp from "./pages/user/DownloadApp";
import Resources from "./pages/user/Resources";
import TicketDetails from "./pages/user/TicketDetails";
import CreateTicket from "./pages/user/CreateTicket";

import LmsSupportlist from "./pages/Learningmanagement/Supportlist";
import LmsMyProfile from "./pages/Learningmanagement/MyProfile";
import LmsTicketDetails from "./pages/Learningmanagement/TicketDetails";
import LmsCreateTicket from "./pages/Learningmanagement/CreateTicket";

import TeacherSubscription from "./pages/user/TeacherSubscription";
import SignIn from "./pages/Affiliate/SignIn";
import LmsSignIn from "./pages/Learningmanagement/SignIn";
import LearningmanagementDashboard from "./pages/Learningmanagement/Dashboard";
import lmseamxcreate from "./pages/Learningmanagement/Createtest";
import LmsSubscription from "./pages/Learningmanagement/Subscription";
import Lmsuserexam from "./pages/Learningmanagement/ExamList";
import Lmsstudentexam from "./pages/Learningmanagement/StdentExamList";
import Lmsuserexamdetails from "./pages/Learningmanagement/Report";
import LmsStudentReport from "./pages/Learningmanagement/StudentReport";
import UserLmsStudentReport from "./pages/user/StudentReport";
import Lmsstudentsreports from "./pages/Learningmanagement/Reports";
import Lmsexamresult from "./pages/Learningmanagement/ExamReslut";
import LmsExam from "./pages/Learningmanagement/LmsExam";
import LmsSubscribeUsers from "./pages/Learningmanagement/SubscribeUsers";
import LmsTeacherSubscribeUsers from "./pages/user/SubscribeTeacher";
import LmsBlockUsers from "./pages/Learningmanagement/BlockUsers";
import LmsBlockteacher from "./pages/user/BlockTeacher";
import LmsCancelrequest from "./pages/user/CancleRequest";
import LmsCancelrequestteacher from "./pages/Learningmanagement/CancleRequest";
import LmsAcceptrequest from "./pages/user/AcceptRequest";
import LmsAcceptrequestteacher from "./pages/Learningmanagement/AcceptRequest";

import Cookies from "js-cookie";
import RefferUser from "./pages/Affiliate/RefferUser";
import MyTopic from "./pages/MyTopic";
import ForumHome from "./pages/ForumHome";
import SingleTopicHome from "./pages/SingleTopiceHome";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import TermsAndUse from "./pages/TermsAndUse";

export default function Routes() {
    const isAuth = useSelector(userAuth); //using redux useSelector here
    var role = !!Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));  
    var affiliateRole = !!role && role.affiliate_role;

    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/">
                    {isAuth && role.affiliate_role == 7 || role.affiliate_role == 8 ? (
                        <>
                            <Redirect to="/lms/dashboard" />
                        </>

                    ) : (
                        <>
                            {isAuth && role.affiliate_role == 5 || role.affiliate_role == 6 || role.affiliate_role == '' ? (
                                <>
                                    <Redirect to="/user/dashboard" />
                                </>
                            ) : (
                                <>
                                    <Home />
                                </>
                            )}
                        </>
                    )}
                </Route>
                <Route exact path="/forum" component={Forum} />
                <Route exact path="/forum/:forumId" component={SingleTopic} />
                <Route exact path="/forum-home/:forumIdHome" component={SingleTopicHome} />
                <Route exact path="/about" component={About} />
                <Route exact path="/contact-us" component={ContactUs} />
                <Route exact path="/terms-condition" component={TermsAndCondition} />
                <Route exact path="/terms-of-use" component={TermsAndUse} />
                <Route exact path="/privacy-policy" component={AffiliateTermsAndCondition} />
                <Route exact path="/disclaimer" component={Disclaimer} />
                {/* <Route
                    exact
                    path="/affiliate-terms-condition"
                    component={AffiliateTermsAndCondition}
                /> */}
                <Route exact path="/blog" component={Blog} />
                <Route exact path="/faq" component={Faq} />
                <Route exact path="/blog/:slug" component={BlogSingle} />
                <Route exact path="/eshop" component={Eshop} />
                <Route exact path="/forum-home" component={ForumHome} />
                <Route exact path="/affiliate" component={Affiliate} />
                <Route exact path="/free-test" component={Freetest} />
                <Route exact path="/free-test/report" component={Report} />
                <Route exact path="/user/verify/:id/:token" component={Verify} />

                {/* Affiliate */}
                <Route exact path="/affiliate/signin" component={SignIn} />

                {/* Learningmaagement */}
                <Route exact path="/lms/signin" component={LmsSignIn} />
                <Route exact path="/lms" component={Learningmanagementsystem} />
                <ProtectedRoute exact path="/lms/dashboard" component={LearningmanagementDashboard} />
                <ProtectedRoute exact path="/lms/create-test" component={lmseamxcreate} />

                <ProtectedRoute exact path="/topic-create" component={Topic} />
                <ProtectedRoute exact path="/my-topic" component={MyTopic} />
                <ProtectedRoute
                    exact
                    path="/user/resume-test/:userTestId"
                    component={ResumeSavedTest}
                />

                <ProtectedRoute exact path="/user/dashboard" component={Dashboard} />
                <Route exact path="/user/buy-package/:id" component={Package} />
                <ProtectedRoute exact path="/user/free-test" component={Freetest} />

                <ProtectedRoute
                    exact
                    path="/user/attempt-free-test/:testId"
                    component={Freetest}
                />
                <ProtectedRoute
                    exact
                    path="/user/lms-exam/:lmsExamtId"
                    component={LmsExam}
                />
                <ProtectedRoute exact path="/lms/my-account" component={LmsMyProfile} />
                <ProtectedRoute exact path="/user/my-account" component={MyProfile} />
                <ProtectedRoute exact path="/user/search-feedback" component={SearchandFeedback} />
                <ProtectedRoute exact path="/user/support" component={Supportlist} />
                <ProtectedRoute exact path="/user/downloadApp" component={DownloadApp} />
                <ProtectedRoute exact path="/user/resources" component={Resources} />
                <ProtectedRoute exact path="/user/supportdetails/:ticketId" component={TicketDetails} />
                <ProtectedRoute exact path="/user/addticket" component={CreateTicket} />

                <ProtectedRoute exact path="/lms/support" component={LmsSupportlist} />
                <ProtectedRoute exact path="/lms/supportdetails/:ticketId" component={LmsTicketDetails} />
                <ProtectedRoute exact path="/lms/addticket" component={LmsCreateTicket} />

                <ProtectedRoute
                    exact
                    path="/user/free-test/report"
                    component={Report}
                />

                {/* payment verified */}
                <ProtectedRoute exact path="/payment_callback" component={Callback} />

                <ProtectedRoute exact path="/user/reports" component={MyReports} />
                <ProtectedRoute exact path="/user/report/:testId" component={Report} />

                <ProtectedRoute
                    exact
                    path="/user/subscription"
                    component={Subscription}
                />
                <ProtectedRoute
                    exact
                    path="/user/subscription/:subscriptionId"
                    component={SubscriptionDetail}
                />
                {/* Lms routes */}
                <ProtectedRoute
                    exact
                    path="/lms/subscription"
                    component={LmsSubscription}
                />
                <ProtectedRoute
                    exact
                    path="/user/teachersubscription"
                    component={TeacherSubscription}
                />
                <ProtectedRoute
                    exact
                    path="/lms/exam"
                    component={Lmsuserexam}
                />
                <ProtectedRoute
                    exact
                    path="/user/lmsexam"
                    component={Lmsstudentexam}
                />
                <ProtectedRoute
                    exact
                    path="/lms/examdetails/:examId"
                    component={Lmsuserexamdetails}
                />

                <ProtectedRoute
                    exact
                    path="/lms/studentexamlist/:studentsId"
                    component={Lmsstudentsreports}
                />
                <ProtectedRoute
                    exact
                    path="/lms/studentexamdetails/:examId/:studentsId"
                    component={LmsStudentReport}
                />
                <ProtectedRoute
                    exact
                    path="/user/studentexamdetails/:examId/:studentsId"
                    component={UserLmsStudentReport}
                />

                <ProtectedRoute
                    exact
                    path="/lms/results"
                    component={Lmsexamresult}
                />
                <ProtectedRoute
                    exact
                    path="/lms/subscriptionrequest/:studentId"
                    component={LmsSubscribeUsers}
                />
                <ProtectedRoute
                    exact
                    path="/lms/teachersubscriptionrequest/:teacherId"
                    component={LmsTeacherSubscribeUsers}
                />

                <ProtectedRoute
                    exact
                    path="/lms/subscriptionblock/:studentId"
                    component={LmsBlockUsers}
                />
                <ProtectedRoute
                    exact
                    path="/lms/subscriptionblockteacher/:teacherId"
                    component={LmsBlockteacher}
                />
                <ProtectedRoute
                    exact
                    path="/lms/request-cancle/:teacherId"
                    component={LmsCancelrequest}
                />
                <ProtectedRoute
                    exact
                    path="/lms/student-request-cancle/:studentId"
                    component={LmsCancelrequestteacher}
                />
                <ProtectedRoute
                    exact
                    path="/lms/request-accept/:teacherId"
                    component={LmsAcceptrequest}
                />
                <ProtectedRoute
                    exact
                    path="/lms/student-request-accept/:studentId"
                    component={LmsAcceptrequestteacher}
                />


                {/* Affiliate routes */}
                <AffiliateRoute
                    exact
                    path="/affiliate/dashboard"
                    component={AffiliateDashboard}
                    isAffiliate={affiliateRole}
                />
                <AffiliateRoute
                    exact
                    path="/affiliate/withdraw"
                    component={Withdraw}
                    isAffiliate={affiliateRole}
                />
                <AffiliateRoute
                    exact
                    path="/affiliate/subscribe_users"
                    component={SubscribeUsers}
                    isAffiliate={affiliateRole}
                />
                <AffiliateRoute
                    exact
                    path="/affiliate/transaction"
                    component={Transaction}
                    isAffiliate={affiliateRole}
                />
                <AffiliateRoute
                    exact
                    path="/affiliate/refferUser"
                    component={RefferUser}
                    isAffiliate={affiliateRole}
                />


                <Route exact path="*" component={NotFound} status={404} />
            </Switch>
        </Router>
    );
}
