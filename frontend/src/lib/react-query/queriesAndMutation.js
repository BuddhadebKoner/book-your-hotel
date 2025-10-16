// // Mutation to check login status
// export const useCheckLogin = () => {
//    const queryClient = useQueryClient()

//    return useMutation({
//       mutationKey: QUERY_KEYS.CHECK_LOGIN,
//       mutationFn: authAPI.checkLogin,
//       onSuccess: data => {
//          if (data.success) {
//             // Update login status in cache
//             queryClient.setQueryData(QUERY_KEYS.CHECK_LOGIN, {
//                success: true,
//                isLoggedIn: data.isLoggedIn,
//                user: data.user || null,
//                hasProfile: data.hasProfile || false,
//                clerkId: data.clerkId,
//                message: 'Login status checked',
//                timestamp: new Date().toISOString(),
//             })
//          }
//       },
//       onError: error => {
//          console.error('Login check failed:', error)
//       },
//    })
// }