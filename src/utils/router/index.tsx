import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "@/utils/router/protected_route"

import {
  LoginPage,
  SignupPage,
  HomePage,
  LessonPage,
  FileListPage,
  ChatPage,
  EditProfile,
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
import TestPage from "@/pages/test"

export const router = createBrowserRouter([
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
        path: "/edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
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
        element: <ExamAuthoring />,
      },
      {
        path: "/exam/paper",
        element: <ExamPaper />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/create/lesson",
        element: <LessonCreatePage />
      },
      {
        path: "/test",
        element: <TestPage />,
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
