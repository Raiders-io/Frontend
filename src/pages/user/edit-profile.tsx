import { ThemeDropDown } from '@/components/themeDropDown'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

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
		</CardContent>
	</Card>
	</>
	)
}
