import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "@/utils/router/protected_route"
import {
  LoginPage,
  SignupPage,
  HomePage,
  LessonPage,
  FileListPage,
  ChatPage,
  AboutPage,
  ContactPage,
  NotFound,
  ExamAuthoring,
  ExamPaper,
  PrivacyPolicy,
  TermsOfService,
  CookiesPage,
  DataRequestPage,
  LessonCreatePage,
  RootLayout,
  SearchPage,
  GDPRPage,
  MyLessonsPage,
  EditLessonPage,
  ChooseUsername,
  ProfilePage,
  PublicProfilePage,
  Settings,
} from "@/utils/router/lazyRoutes"
import { PATHS } from "@/utils/router/paths";

export const router = createBrowserRouter([
  {
    path: PATHS.chooseUsername,
    element: (
      <ProtectedRoute>
        <ChooseUsername />
      </ProtectedRoute>
    ),
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: PATHS.home,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.login,
        element: <LoginPage />,
      },
      {
        path: PATHS.signup,
        element: <SignupPage />,
      },
      {
        path: "/lessons/:slug",
        element: <LessonPage />,
      },
      {
        path: PATHS.fileList,
        element: (
          <ProtectedRoute>
            <FileListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.chat,
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.profile,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.user(":userId"),
        element: <PublicProfilePage />,
      },
      {
        path: PATHS.settings,
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.about,
        element: <AboutPage />,
      },
      {
        path: PATHS.contact,
        element: <ContactPage />,
      },
      {
        path: PATHS.privacy,
        element: <PrivacyPolicy />,
      },
      {
        path: PATHS.terms,
        element: <TermsOfService />,
      },
      {
        path: PATHS.gdpr,
        element: <GDPRPage />,
      },
      {
        path: PATHS.cookies,
        element: <CookiesPage />,
      },
      {
        path: PATHS.dataRequest,
        element: <DataRequestPage />,
      },
      {
        path: PATHS.examAuthoring,
        element: (
          <ProtectedRoute>
            <ExamAuthoring />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.examPaper,
        element: (
          <ProtectedRoute>
            <ExamPaper />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.examPaperView(":id"),
        element: (
          <ProtectedRoute>
            <ExamPaper />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.search,
        element: <SearchPage />,
      },
      {
        path: PATHS.lessonCreate,
        element: <LessonCreatePage />
      },
      {
        path: PATHS.lessonView(":author", ":slug"),
        element: <LessonPage />,
      },
      {
        path: PATHS.lessonEdit(":author", ":slug"),
        element: <EditLessonPage />,
      },
      {
        path: PATHS.myLesson,
        element: <MyLessonsPage />,
      },
      {
        path: PATHS.any,
        element: <NotFound />,
      },
    ],
  },
])
