export default function getBearer(NetworkRequest) {
    const authType = NetworkRequest?.headers?.authorization?.split(' ')[0]
    console.log(authType)
    if (authType === 'Bearer') {
      console.log(`at getBearer - ${NetworkRequest?.headers?.authorization.split(' ')[1]}`)
      return NetworkRequest?.headers?.authorization.split(' ')[1]
    }
}