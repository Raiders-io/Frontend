import { router } from "@/utils/router";
import { PATHS } from "@/utils/router/paths";

const createNavigator = (path: string, options?: { replace?: boolean }) => {
  return () => router.navigate(path, options);
};

export const changePageHome = createNavigator(PATHS.home);
export const changePageLogin = createNavigator(PATHS.login);
export const changePageSignup = createNavigator(PATHS.signup);
export const changePageProfile = createNavigator(PATHS.profile);
export const changePageFileList = createNavigator(PATHS.fileList);
export const changePageLessons = createNavigator(PATHS.myLesson);
export const changePageChooseUsername = createNavigator(PATHS.chooseUsername, { replace: true });
export const changePageLessonCreate = createNavigator(PATHS.lessonCreate);
export const changePageEditProfile = createNavigator(PATHS.settings);
export const changePageChat = createNavigator(PATHS.chat);
export const changePageAbout = createNavigator(PATHS.about);
export const changePageContact = createNavigator(PATHS.contact);
export const changePageTerms = createNavigator(PATHS.terms);
export const changePagePrivacy = createNavigator(PATHS.privacy);
export const changePageCookies = createNavigator(PATHS.cookies);

export const changePageUser = (userId: string) => {
  router.navigate(PATHS.user(userId));
};

export const changePageLessonEdit = (author: string, slug: string) => {
  router.navigate(PATHS.lessonEdit(author, slug));
};

export const changePageLessonView = (author: string, slug: string) => {
  router.navigate(PATHS.lessonView(author, slug));
};
