// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useAuthStore } from '@/utils/stores/auth_store'
import { objectService } from '@/services/object_service'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js'

const indexSchema = z.object({})

type indexForm = z.infer<typeof indexSchema>

export default function IndexPage() {
	const { register, handleSubmit, formState } = useForm<indexForm>({
		resolver: zodResolver(indexSchema),
	})

	const onSubmit = async () => {
		try {
			const response = await objectService.index()
			console.log('Object index response:', response)
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	return (
		<div>
			<h3>Index of files</h3>
			<form id="indexFilesForm" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<button type="submit">Submit</button>
				</div>
			</form>
			<div id="fileExplorer">
				<div id="fileList"></div>
			</div>
		</div>
	)
}
