import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { roommateService } from '../../api/axiosConfig'
import AddRoommate from './AddRoommate'
import { PageLoader } from '../../components/common/Loaders'

export default function EditRoommate() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { roommateService.getById(id).then(r => setData(r.data)).finally(() => setLoading(false)) }, [id])
  if (loading) return <PageLoader />
  return <AddRoommate editId={id} initialData={data} />
}
