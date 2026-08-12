import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import ProtectedRoute from '@/utils/router/protected_route'

const LoginPage = lazy(() => import('@/pages/auth/login'))
const SignupPage = lazy(() => import('@/pages/auth/signup'))
const HomePage = lazy(() => import('@/pages/home'))
const LessonHomePage = lazy(() => import('@/pages/lesson/lesson_home_page'))
const LessonPage = lazy(() => import('@/pages/lesson/lesson_page'))
const FileListPage = lazy(() => import('@/pages/file/index'))
const ChatPage = lazy(() => import('@/pages/services/chat/chat_page'))
const EditProfile = lazy(() => import('@/pages/user/edit-profile'))
const AboutPage = lazy(() => import('@/pages/about'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/signup',
		element: <SignupPage />,
	},
	{
		path: '/lessons/:slug',
		element: <LessonPage />,
	},
	{
		path: '/lessons',
		element: <LessonHomePage />,
	},
	{
		path: '/file/list',
		element: (
			// <ProtectedRoute>
				<FileListPage />
			// </ProtectedRoute>
		),
	},
	{
		path: '/chat',
		element: (
			<ProtectedRoute>
				<ChatPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/edit-profile',
		element: (
			<ProtectedRoute>
				<EditProfile />
			</ProtectedRoute>
		),
	},
	{
		path: '/about',
		element: <AboutPage />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
])
