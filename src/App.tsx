import { RouterProvider } from 'react-router-dom'
import { router } from '@/utils/router'
import TopNavBar from './components/TopNavBar'

export default function App() {
	return (
	<>
		<TopNavBar />
		<RouterProvider router={router} />
	</>
	)
}