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
} from "@/utils/router/lazyRoutes"

export const router = createBrowserRouter([
  {
    path: "/onboarding/username",
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
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/lessons/:slug",
        element: <LessonPage />,
      },
      {
        path: "/file/list",
        element: (
          // <ProtectedRoute>
          <FileListPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:identifier",
        element: <PublicProfilePage />,
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/gdpr",
        element: <GDPRPage />,
      },
      {
        path: "/cookies",
        element: <CookiesPage />,
      },
      {
        path: "/data-request",
        element: <DataRequestPage />,
      },
      {
        path: "/exam/authoring",
        element: (
          <ProtectedRoute>
            <ExamAuthoring />
          </ProtectedRoute>
        ),
      },
      {
        path: "/exam/paper",
        element: (
          <ProtectedRoute>
            <ExamPaperList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/exam/paper/:id",
        element: (
          <ProtectedRoute>
            <ExamPaper />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/create/lesson",
        element: <LessonCreatePage/>
      },
      // {
      //   path: "/lesson/:author",
      // },
      {
        path: "/lesson/:author/:slug",
        element: <LessonPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
