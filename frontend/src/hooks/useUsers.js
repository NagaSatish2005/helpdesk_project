import { useUserContext } from '../context/UserContext'

export default function useUsers() {
	return useUserContext()
}
