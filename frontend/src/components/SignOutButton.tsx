import { useMutation, useQueryClient } from "react-query"
import * as apiClient from '../api-clients';
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {

    const queryClient = useQueryClient();
    const {showToast} = useAppContext();


    const mutation = useMutation(apiClient.signOut,{
        onSuccess:async()=> {
            await queryClient.invalidateQueries('validateToken');
            showToast({message:"Logout Successfully",type:"SUCCESS"});

        },
        onError:(error:Error)=> {
           showToast({message:error.message,type:"ERROR"})
        }
    })

    const handleLogout = () => {
        mutation.mutate()
    }

  return (
    <button onClick={handleLogout} className="text-blue-600 px-3 font-bold bg-white rounded-lg hover:bg-gray-100">
        Sign out
    </button>
  )
}

export default SignOutButton