export default function getBearer(NetworkRequest) {
    const authType = NetworkRequest?.headers?.authorization?.split(' ')[0]
    if (authType === 'Bearer') {
      return NetworkRequest?.headers?.authorization.split(' ')[1]
    }
}