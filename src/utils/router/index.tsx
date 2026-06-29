import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import SignupPage from '@/pages/auth/signup'
import HomePage from '@/pages/home'
import ChatPage from '@/pages/services/chat/chat_page'
import ProtectedRoute from '@/utils/router/protected_route'
import LessonPage from '@/pages/lesson/lesson_home_page'
import LessonHomePage from '@/pages/lesson/lesson_home_page'
import FileListPage from '@/pages/file/index'

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
		path: '/lessons/',
		element: <LessonHomePage />,
	},
	{
		path: '/lessons/:slug',
		element: <LessonPage />,
	},
	{
		path: '/file/list',
		element: <FileListPage />,
	},
	{
		path: '/chat',
		element: <ChatPage />,
	},
])
