import { createBrowserRouter, Outlet } from "react-router-dom"
import { lazy } from "react"
import ProtectedRoute from "@/utils/router/protected_route"
import TopNavBar from "@/components/TopNavBar"
import ProfilePage, { PublicProfilePage } from "@/pages/user/ProfilePage"

const LoginPage = lazy(() => import("@/pages/auth/login"))
const SignupPage = lazy(() => import("@/pages/auth/signup"))
const HomePage = lazy(() => import("@/pages/home"))
const LessonPage = lazy(() => import("@/pages/lesson/lesson_page"))
const FileListPage = lazy(() => import("@/pages/file/index"))
const ChatPage = lazy(() => import("@/pages/services/chat/chat_page"))
const Settings = lazy(() => import("@/pages/user/Settings"))
const AboutPage = lazy(() => import("@/pages/about"))
const ContactPage = lazy(() => import("@/pages/contact"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const ExamAuthoring = lazy(() => import("@/pages/exam/ExamAuthoring"))
const ExamPaper = lazy(() => import("@/pages/exam/ExamPaper"))
const PrivacyPolicy = lazy(() => import("@/pages/legal/privacy"))
const TermsOfService = lazy(() => import("@/pages/legal/terms"))
const GDPRPage = lazy(() => import("@/pages/legal/gdpr"))
const CookiesPage = lazy(() => import("@/pages/legal/cookies"))
const DataRequestPage = lazy(() => import("@/pages/legal/gdpr"))
const SearchPage = lazy(() => import("@/pages/search"))
import { Toaster } from "@/components/ui/sonner"

export function RootLayout() {
  return (
    <div>
      <TopNavBar />
      <Toaster visibleToasts={5} position="bottom-right" expand={false} closeButton={true} />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}

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
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:id",
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
