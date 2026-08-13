import { ThemeDropDown } from '@/components/themeDropDown'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { UserX } from 'lucide-react'
import { authService } from '@/services/auth_service'
import { router } from '@/utils/router'
import { useAuthStore } from '@/utils/stores/auth_store'

export default function EditProfile() {
	return (
	<>
	<Card>
		<CardHeader>
			<h1>Edit Profile Page</h1>
		</CardHeader>
		<CardContent>
			<Card className="w-full max-w-md p-4">
				<CardHeader>
					<h2>Edit Profile</h2>
				</CardHeader>
				<CardContent>
					<Textarea placeholder="Edit your profile information 1 here..." className="w-full h-12 p-2 border rounded" />
					<Textarea placeholder="Edit your profile information 2 here..." className="w-full h-12 p-2 border rounded" />
					<Textarea placeholder="Edit your profile information 3 here..." className="w-full h-12 p-2 border rounded" />
				</CardContent>
			</Card>
			<Separator className="my-4" />
			<Card className="w-full max-w-md p-4">
				<CardHeader>
					<h2>Here you can edit your preferences.</h2>
				</CardHeader>				
				<CardContent>
					<ThemeDropDown />
				</CardContent>
			</Card>
			<Card className="w-full max-w-md p-4">
				<CardHeader>
					<h2>Account Data</h2>
				</CardHeader>				
				<CardContent>
					<DeleteAccountDialog />
				</CardContent>
			</Card>
		</CardContent>
	</Card>
	</>
	)
}

export const DeleteAccountDialog = () => {
	const { logout } = useAuthStore()

	const handleDeleteAccount = async () => {
		try {
			await authService.deleteAccount()
			logout()
			router.navigate('/login')
		} catch (error) {
			console.error('Error deleting account:', error)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					onSelect={(e) => e.preventDefault()}
					className="cursor-pointer"
				>
					<UserX />
					Delete Account
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
					<UserX />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete Account</AlertDialogTitle>
					<AlertDialogDescription>
					Your account will be permanently deleted and you will be logged out. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={handleDeleteAccount}>
					Delete Account
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
