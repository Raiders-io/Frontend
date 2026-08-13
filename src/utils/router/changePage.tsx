import { router } from "@/utils/router"

export const changePageHome = () => {
	router.navigate('/')
}

export const changePageLogin = () => {
	router.navigate('/login')
}

export const changePageSignup = () => {
	router.navigate('/signup')
}

export const changePageProfile = () => {
	router.navigate('/profile')
}

export const changePageFileList = () => {
	router.navigate('/file/list')
}

export const changePageLessons = () => {
	router.navigate('/lessons')
}

export const changePageFriends = () => {
	router.navigate('/friends')
}

export const changePageEditProfile = () => {
	router.navigate('/edit-profile')
}

export const changePageChat = () => {
	router.navigate('/chat')
}
