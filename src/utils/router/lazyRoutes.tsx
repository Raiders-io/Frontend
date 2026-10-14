import { lazy } from "react"

const LoginPage = lazy(() => import("@/pages/auth/login"))
const SignupPage = lazy(() => import("@/pages/auth/signup"))
const HomePage = lazy(() => import("@/pages/home"))
const LessonPage = lazy(() => import("@/pages/lesson/LessonPage"))
const FileListPage = lazy(() => import("@/pages/file/index"))
const ChatPage = lazy(() => import("@/pages/services/chat/chat_page"))
const EditProfile = lazy(() => import("@/pages/user/edit-profile"))
const AboutPage = lazy(() => import("@/pages/about"))
const ContactPage = lazy(() => import("@/pages/contact"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const ExamAuthoring = lazy(() => import("@/pages/exam/ExamAuthoring"))
const ExamPaper = lazy(() => import("@/pages/exam/ExamPaper"))
const PrivacyPolicy = lazy(() => import("@/pages/legal/privacy"))
const TermsOfService = lazy(() => import("@/pages/legal/terms"))
const CookiesPage = lazy(() => import("@/pages/legal/cookies"))
const DataRequestPage = lazy(() => import("@/pages/legal/gdpr"))
const LessonCreatePage = lazy(() => import("@/pages/lesson/lesson_create_page"))
const RootLayout = lazy(() => import("@/utils/router/RootLayout"))
const SearchPage = lazy(() => import("@/pages/search"))
const GDPRPage = lazy(() => import("@/pages/legal/gdpr"))

export {
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
}
