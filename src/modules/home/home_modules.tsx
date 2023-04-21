
import { Suspense, lazy } from "react"
import Loading from "../../components/loading/Loading"

const HomeLazy = lazy(() => import(/* webpackChunkName: "home" */  '../../screens/home/Home'))


export default function HomeModule() {
  return (
    <Suspense fallback={<Loading />} >
      <HomeLazy />
    </Suspense>
  )
}
